import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { useGreeting } from '../hooks/useGreeting';

const ICON_COLORS = {
  plastic: 'bg-green-light/15 text-green-light',
  paper:   'bg-teal-light/15 text-teal-light',
  battery: 'bg-[#f4a261]/15 text-[#f4a261]',
  can:     'bg-[#a8dadc]/15 text-[#a8dadc]',
};

const OBJ_META = {
  plastic:     { icon: 'fa-bottle-water', iconClass: 'plastic', name: 'Botol Plastik PET',  points: '+30 EP' },
  paper:       { icon: 'fa-newspaper',    iconClass: 'paper',   name: 'Kertas / Koran',     points: '+20 EP' },
  battery:     { icon: 'fa-battery-full', iconClass: 'battery', name: 'Baterai AA',         points: '+40 EP' },
  can:         { icon: 'fa-cube',         iconClass: 'can',     name: 'Kaleng Aluminium',   points: '+25 EP' },
  cardboard:   { icon: 'fa-box',          iconClass: 'paper',   name: 'Kardus',             points: '+10 EP' },
  glass:       { icon: 'fa-wine-bottle',  iconClass: 'can',     name: 'Botol Kaca',         points: '+25 EP' },
  plastic_bag: { icon: 'fa-bag-shopping', iconClass: 'plastic', name: 'Kantong Plastik',    points: '+10 EP' },
};


// ── Animation variants ──────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

function timeAgo(date) {
  if (!date) return '';
  const d   = date?.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60)   return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

export default function HomePage() {
  const { navigate, ecoPoints, scanCount, level, scannedObjects, user } = useApp();
  const greeting  = useGreeting();
  const formatted = ecoPoints.toLocaleString('id-ID');

  // Real name from Firebase
  const displayName = user?.displayName || 'EcoHero';
  const firstName   = displayName.split(' ')[0];

  // Level progress
  const levelPct    = ((ecoPoints % 500) / 500) * 100;
  const circumference = 213.63;
  const offset      = circumference * (1 - levelPct / 100);

  // CO2 saved (estimasi: 50g per scan)
  const co2Saved    = ((scanCount * 50) / 1000).toFixed(1);

  // Daily scan count (scans hari ini)
  const today       = new Date().toDateString();
  const todayScans  = scannedObjects.filter(s => {
    const d = s.scannedAt?.toDate ? s.scannedAt.toDate() : new Date(s.scannedAt);
    return d.toDateString() === today;
  }).length;

  // Recent activity dari scannedObjects (5 terbaru)
  const recentActivity = [...scannedObjects]
    .reverse()
    .slice(0, 5)
    .map((s, i) => ({
      id: i,
      ...(OBJ_META[s.objectId] || { icon: 'fa-recycle', iconClass: 'plastic', name: s.objectId, points: '+? EP' }),
      time: timeAgo(s.scannedAt),
    }));

  // Daily challenge: scan 5 objek hari ini
  const challengeProgress = Math.min(todayScans, 5);
  const challengePct      = (challengeProgress / 5) * 100;

  return (
    <motion.div className="page-container" initial="hidden" animate="show" variants={stagger}>

      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-start justify-between mb-6">
        <div>
          <p className="text-green-light text-sm font-medium">{greeting}</p>
          <h2 className="text-xl font-bold text-white">{firstName} 👋</h2>
          <p className="text-white/50 text-xs mt-0.5">
            {todayScans > 0
              ? <>Kamu sudah scan <strong className="text-white">{todayScans} objek</strong> hari ini. Terus semangat!</>
              : 'Belum ada scan hari ini. Yuk mulai! 🌿'}
          </p>
        </div>

        {/* Level Ring */}
        <motion.div variants={scaleIn} className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#52B788" />
                <stop offset="100%" stopColor="#40BFB0" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(82,183,136,0.15)" strokeWidth="6" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="url(#ringGrad)" strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-green-light font-bold text-sm leading-none">Lv.{level}</span>
            <span className="text-white/50 text-[9px]">EcoHero</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={stagger} className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: 'fa-seedling',  label: 'EcoPoints',   value: formatted,       change: `Level ${level}`,    cardClass: 'from-green-dark to-green-mid' },
          { icon: 'fa-camera',    label: 'Total Scan',  value: scanCount,       change: `${todayScans} hari ini`, cardClass: 'from-teal-dark to-teal-mid' },
          { icon: 'fa-wind',      label: 'CO₂ Dihemat', value: `${co2Saved}kg`, change: 'Estimasi total',   cardClass: 'from-[#162019] to-[#1a2a1e]' },
        ].map(card => (
          <motion.div key={card.label}
            className={`rounded-2xl p-3.5 bg-gradient-to-br ${card.cardClass} border border-white/5 flex flex-col gap-1`}
            variants={scaleIn}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <i className={`fa-solid ${card.icon} text-sm`} />
            </div>
            <span className="text-white/60 text-[10px] font-medium mt-1">{card.label}</span>
            <span className="text-white font-bold text-sm leading-none">{card.value}</span>
            <span className="text-green-light/70 text-[10px]">{card.change}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Daily Challenge */}
      <motion.div variants={fadeUp} className="eco-card mb-6 relative overflow-hidden" whileHover={{ scale: 1.01 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-light/5 to-teal-light/5 pointer-events-none" />
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 bg-[#f4a261]/15 text-[#f4a261] text-[10px] font-bold px-2.5 py-1 rounded-full mb-2">
              <i className="fa-solid fa-bolt text-[9px]" /> Tantangan Harian
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">Scan 5 Objek Hari Ini</h3>
            <p className="text-white/50 text-xs mb-3 leading-relaxed">
              Pindai 5 objek berbeda hari ini untuk mendapatkan bonus EcoPoints!
            </p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-light to-teal-light transition-all duration-700"
                  style={{ width: `${challengePct}%` }}
                />
              </div>
              <span className="text-white/60 text-xs">{challengeProgress}/5</span>
            </div>
            {challengeProgress >= 5
              ? <div className="inline-flex items-center gap-1.5 bg-green-light/15 text-green-light text-xs font-bold px-3 py-1.5 rounded-xl">
                  <i className="fa-solid fa-check" /> Tantangan Selesai! 🎉
                </div>
              : <button className="btn-primary small" onClick={() => navigate('scan')}>
                  <i className="fa-solid fa-camera" /> Scan Sekarang
                </button>
            }
          </div>
          <div className="flex flex-col items-center justify-center bg-[#f4a261]/10 rounded-2xl p-4 min-w-[72px]">
            <i className="fa-solid fa-gift text-[#f4a261] text-2xl mb-1" />
            <span className="text-[#f4a261] font-bold text-sm">+250 EP</span>
            <span className="text-white/40 text-[10px]">Reward</span>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">Aktivitas Terbaru</h3>
      </motion.div>

      <div className="flex flex-col gap-2 mb-8">
        {recentActivity.length > 0 ? recentActivity.map((act, i) => (
          <motion.div key={act.id}
            className="eco-card flex items-center gap-3 py-3 hover:border-green-light/20 transition-colors duration-200"
            variants={fadeUp}
            whileHover={{ x: 4 }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ICON_COLORS[act.iconClass]}`}>
              <i className={`fa-solid ${act.icon}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{act.name}</p>
              <p className="text-white/40 text-xs">{act.time}</p>
            </div>
            <span className="text-green-light text-xs font-bold flex-shrink-0">{act.points}</span>
          </motion.div>
        )) : (
          <div className="eco-card flex flex-col items-center justify-center py-8 gap-3">
            <i className="fa-solid fa-camera text-white/15 text-3xl" />
            <p className="text-white/30 text-sm">Belum ada aktivitas scan</p>
            <button className="btn-primary small" onClick={() => navigate('scan')}>
              <i className="fa-solid fa-camera" /> Mulai Scan
            </button>
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-30">
        <motion.button
          onClick={() => navigate('scan')}
          className="btn-primary rounded-2xl shadow-xl shadow-green-light/30 flex items-center gap-2 px-5 py-3.5"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(82,183,136,0.4)" }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
        >
          <i className="fa-solid fa-camera" />
          <span className="text-sm font-semibold">Scan Cepat</span>
        </motion.button>
      </div>
    </motion.div>
  );
}