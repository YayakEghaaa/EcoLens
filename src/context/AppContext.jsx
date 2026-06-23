import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

// ── [SOUND] Helper ringan untuk play sound di luar komponen React ──
// Tidak bisa pakai hook di sini karena AppContext bukan komponen biasa,
// tapi audioContext sudah ada di ScanPage — pakai HTMLAudioElement saja yang lebih simpel.
// HTMLAudioElement cocok untuk one-shot sound di context/non-hook environment.
function playSound(src, volume = 0.7) {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => {}); // Silent fail jika autoplay policy block
  } catch (_) {}
}

const AppContext = createContext(null);

// ── Achievement definitions ─────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_scan',    icon: 'fa-camera',      name: 'First Scan',      desc: 'Scan pertamamu!',              color: '#52B788', condition: (u) => u.totalScans >= 1   },
  { id: 'scan_5',        icon: 'fa-layer-group',  name: '5 Scans',         desc: 'Sudah scan 5 objek',           color: '#40BFB0', condition: (u) => u.totalScans >= 5   },
  { id: 'scan_10',       icon: 'fa-star',         name: '10 Scans',        desc: 'Sudah scan 10 objek',          color: '#f4a261', condition: (u) => u.totalScans >= 10  },
  { id: 'scan_25',       icon: 'fa-fire',         name: 'Scanner Pro',     desc: 'Sudah scan 25 objek',          color: '#EF4444', condition: (u) => u.totalScans >= 25  },
  { id: 'eco_100',       icon: 'fa-seedling',     name: 'Eco Starter',     desc: 'Kumpulkan 100 EcoPoints',      color: '#52B788', condition: (u) => u.ecoPoints >= 100  },
  { id: 'eco_500',       icon: 'fa-leaf',         name: 'Eco Warrior',     desc: 'Kumpulkan 500 EcoPoints',      color: '#40BFB0', condition: (u) => u.ecoPoints >= 500  },
  { id: 'eco_1000',      icon: 'fa-earth-asia',   name: 'Earth Saver',     desc: 'Kumpulkan 1.000 EcoPoints',    color: '#9B72CF', condition: (u) => u.ecoPoints >= 1000 },
  { id: 'level_3',       icon: 'fa-trophy',       name: 'Level 3',         desc: 'Capai level 3',                color: '#f4a261', condition: (u) => u.level >= 3        },
  { id: 'level_5',       icon: 'fa-crown',        name: 'Eco Master',      desc: 'Capai level 5',                color: '#EF4444', condition: (u) => u.level >= 5        },
  { id: 'level_10',      icon: 'fa-gem',          name: 'Legend',          desc: 'Capai level 10',               color: '#9B72CF', condition: (u) => u.level >= 10       },
];

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('landing');
  const [toast, setToast]             = useState(null);

  // Auth
  const [user, setUser]       = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // User data
  const [ecoPoints, setEcoPoints]           = useState(0);
  const [scanCount, setScanCount]           = useState(0);
  const [level, setLevel]                   = useState(1);
  const [badges, setBadges]                 = useState([]);
  const [scannedObjects, setScannedObjects] = useState([]);

  // Profile modal
  const [profileOpen, setProfileOpen] = useState(false);

  // ── Auth listener ───────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserData(firebaseUser.uid);
      } else {
        setUser(null);
        resetUserData();
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // ── Load user data ──────────────────────────────
  const loadUserData = async (uid) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      if (snap.exists()) {
        const d = snap.data();
        setEcoPoints(d.ecoPoints   ?? 0);
        setScanCount(d.totalScans  ?? 0);
        setLevel(d.level           ?? 1);
        setBadges(d.badges         ?? []);
        setScannedObjects(d.scannedObjects ?? []);
      } else {
        await createNewUser(uid);
      }
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const createNewUser = async (uid) => {
    const newUser = { ecoPoints: 0, level: 1, totalScans: 0, scannedObjects: [], badges: [], createdAt: new Date() };
    await setDoc(doc(db, 'users', uid), newUser);
    setEcoPoints(0); setScanCount(0); setLevel(1); setBadges([]); setScannedObjects([]);
  };

  const resetUserData = () => {
    setEcoPoints(0); setScanCount(0); setLevel(1); setBadges([]); setScannedObjects([]);
  };

  // ── Check & unlock achievements ─────────────────
  const checkAchievements = useCallback(async (uid, userData, currentBadges) => {
    const newBadges = [...currentBadges];
    const unlocked  = [];

    for (const achievement of ACHIEVEMENTS) {
      if (!newBadges.includes(achievement.id) && achievement.condition(userData)) {
        newBadges.push(achievement.id);
        unlocked.push(achievement);
      }
    }

    if (unlocked.length > 0) {
      setBadges(newBadges);
      await updateDoc(doc(db, 'users', uid), { badges: newBadges });
      // ── [SOUND] Achievement unlock ────────────────────
      // Hanya bunyi sekali meski unlock beberapa badge sekaligus
      playSound('/assets/sounds/Achievement.mp3', 0.7);
      // Show toast for each new badge
      unlocked.forEach((b, i) => {
        setTimeout(() => {
          setToast({ message: `🏆 Badge baru: ${b.name}!`, type: 'success', id: Date.now() + i });
        }, i * 1500);
      });
    }
  }, []);

  // ── Add points ──────────────────────────────────
  const addPoints = useCallback(async (pts, objectId) => {
    if (!user) return;

    const newPoints  = ecoPoints + pts;
    const newCount   = scanCount + 1;
    const newLevel   = Math.floor(newPoints / 500) + 1;
    const newScanned = [...scannedObjects, { objectId, scannedAt: new Date() }];

    setEcoPoints(newPoints);
    setScanCount(newCount);
    setLevel(newLevel);
    setScannedObjects(newScanned);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ecoPoints: newPoints,
        totalScans: newCount,
        level: newLevel,
        scannedObjects: newScanned,
      });

      // Check achievements
      await checkAchievements(user.uid, { ecoPoints: newPoints, totalScans: newCount, level: newLevel }, badges);

      // Level up toast
      if (newLevel > level) {
        setTimeout(() => setToast({ message: `⬆️ Level Up! Kamu sekarang Level ${newLevel}`, type: 'success', id: Date.now() + 999 }), 800);
      }
    } catch (err) {
      console.error('Error updating points:', err);
    }
  }, [user, ecoPoints, scanCount, level, scannedObjects, badges, checkAchievements]);

  // ── Logout ──────────────────────────────────────
  const logout = useCallback(async () => {
    await signOut(auth);
    setProfileOpen(false);
    navigate('landing');
  }, []);

  // ── Navigate ────────────────────────────────────
  const navigate = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Toast ────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  return (
    <AppContext.Provider value={{
      currentPage, navigate,
      user, authLoading,
      ecoPoints, scanCount, level, badges, scannedObjects,
      addPoints, logout, showToast, toast,
      profileOpen, setProfileOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);