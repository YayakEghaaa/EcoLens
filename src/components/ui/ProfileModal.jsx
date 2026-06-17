import { useApp, ACHIEVEMENTS } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileModal() {
  const { user, ecoPoints, scanCount, level, badges, logout, setProfileOpen } = useApp();

  const photoURL = user?.photoURL;
  const name     = user?.displayName || 'EcoHero';
  const email    = user?.email || '';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const formatted  = ecoPoints.toLocaleString('id-ID');
  const levelPct   = ((ecoPoints % 500) / 500) * 100;
  const nextLevel  = level * 500;
  const pointsLeft = nextLevel - (ecoPoints % 500);

  const earnedBadges  = ACHIEVEMENTS.filter(a => badges.includes(a.id));
  const lockedBadges  = ACHIEVEMENTS.filter(a => !badges.includes(a.id));

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={() => setProfileOpen(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal — slide up */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-[#111A14] border-t border-[#1E2D22]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
      >

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="px-5 pb-10 flex flex-col gap-6">

          {/* Header: Avatar + Info */}
          <div className="flex items-center gap-4 pt-2">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-green-light/30 flex-shrink-0">
              {photoURL
                ? <img src={photoURL} alt="avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gradient-to-br from-green-light to-teal-light flex items-center justify-center text-white text-xl font-bold">{initials}</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-lg truncate">{name}</h2>
              <p className="text-white/40 text-xs truncate">{email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="bg-green-light/15 text-green-light text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Level {level}
                </span>
                <span className="text-white/30 text-[10px]">EcoHero</span>
              </div>
            </div>
            <button
              onClick={() => setProfileOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all flex-shrink-0"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>

          {/* Level Progress */}
          <div className="eco-card p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs font-medium">Progress Level {level}</span>
              <span className="text-green-light text-xs font-bold">{formatted} EP</span>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-light to-teal-light transition-all duration-700"
                style={{ width: `${levelPct}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/30 text-[10px]">Level {level}</span>
              <span className="text-white/30 text-[10px]">{pointsLeft} EP lagi ke Level {level + 1}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'fa-camera',  label: 'Total Scan',  value: scanCount,  color: '#52B788' },
              { icon: 'fa-seedling',label: 'EcoPoints',   value: formatted,  color: '#40BFB0' },
              { icon: 'fa-trophy',  label: 'Badge',       value: `${earnedBadges.length}/${ACHIEVEMENTS.length}`, color: '#f4a261' },
            ].map(stat => (
              <div key={stat.label} className="eco-card p-3 flex flex-col items-center gap-2 text-center">
                <i className={`fa-solid ${stat.icon} text-lg`} style={{ color: stat.color }} />
                <span className="text-white font-bold text-sm">{stat.value}</span>
                <span className="text-white/40 text-[10px]">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Achievement</h3>
              <span className="text-white/30 text-xs">{earnedBadges.length}/{ACHIEVEMENTS.length} unlocked</span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {/* Earned */}
              {earnedBadges.map(a => (
                <div key={a.id} className="flex flex-col items-center gap-1.5 group">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-transform duration-200 group-hover:scale-110"
                    style={{ background: `${a.color}20`, color: a.color }}
                  >
                    <i className={`fa-solid ${a.icon}`} />
                  </div>
                  <span className="text-white/60 text-[9px] text-center leading-tight">{a.name}</span>
                </div>
              ))}

              {/* Locked */}
              {lockedBadges.map(a => (
                <div key={a.id} className="flex flex-col items-center gap-1.5 opacity-30">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg text-white/20">
                    <i className="fa-solid fa-lock text-sm" />
                  </div>
                  <span className="text-white/30 text-[9px] text-center leading-tight">{a.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 font-semibold text-sm py-3.5 rounded-2xl transition-all duration-200"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
            Keluar dari Akun
          </button>
        </div>
      </motion.div>
    </>
  );
}