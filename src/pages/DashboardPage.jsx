import { useEffect, useRef, useState, useMemo } from 'react';
import { useCounter } from '../hooks/useCounter';
import { useApp, ACHIEVEMENTS } from '../context/AppContext';

function AnimatedBar({ pct, color, delay }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 300);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

function ChartBar({ scan, co2, day, active, delay }) {
  const [scanH, setScanH] = useState(0);
  const [co2H, setCo2H]   = useState(0);
  useEffect(() => {
    const t = setTimeout(() => { setScanH(scan); setCo2H(co2); }, delay + 300);
    return () => clearTimeout(t);
  }, [scan, co2, delay]);
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div className="flex items-end gap-0.5 h-24">
        <div
          className={`w-3 rounded-t-sm transition-all duration-700 ${active ? 'opacity-100' : 'opacity-80'}`}
          style={{ height: `${scanH}%`, background: 'linear-gradient(to top, #2D6A4F, #52B788)' }}
        />
        <div
          className="w-3 rounded-t-sm transition-all duration-700 opacity-70"
          style={{ height: `${co2H}%`, background: 'linear-gradient(to top, #1A6B60, #40BFB0)' }}
        />
      </div>
      <span className="text-white/40 text-[10px]">{day}</span>
    </div>
  );
}

const OBJ_CATEGORY = {
  plastic:     { label: 'Plastik',  icon: 'fa-bottle-water', color: '#52B788' },
  plastic_bag: { label: 'Plastik',  icon: 'fa-bottle-water', color: '#52B788' },
  paper:       { label: 'Kertas',   icon: 'fa-newspaper',    color: '#40BFB0' },
  cardboard:   { label: 'Kertas',   icon: 'fa-newspaper',    color: '#40BFB0' },
  battery:     { label: 'Baterai',  icon: 'fa-battery-full', color: '#f4a261' },
  can:         { label: 'Kaleng',   icon: 'fa-cube',         color: '#a8dadc' },
  glass:       { label: 'Kaca',     icon: 'fa-wine-bottle',  color: '#9B72CF' },
};

const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function DashboardPage() {
  const { ecoPoints, scanCount, level, badges, scannedObjects } = useApp();
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Animated counters
  const animScan   = useCounter(scanCount,   1500, visible);
  const animPoints = useCounter(ecoPoints,   1500, visible);
  const animBadges = useCounter(badges.length, 1500, visible);
  const co2Total   = parseFloat(((scanCount * 50) / 1000).toFixed(1));
  const animCo2    = useCounter(co2Total * 10, 1500, visible);

  // ── Weekly chart dari scannedObjects ─────────────
  const weeklyChart = useMemo(() => {
    const today = new Date();
    const days  = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      return { date: d.toDateString(), day: DAY_LABELS[d.getDay()], count: 0 };
    });

    scannedObjects.forEach(s => {
      const d = s.scannedAt?.toDate ? s.scannedAt.toDate() : new Date(s.scannedAt);
      const ds = d.toDateString();
      const found = days.find(day => day.date === ds);
      if (found) found.count++;
    });

    const maxCount = Math.max(...days.map(d => d.count), 1);
    return days.map((d, i) => ({
      day:    d.day,
      scan:   Math.round((d.count / maxCount) * 100),
      co2:    Math.round((d.count / maxCount) * 80),
      active: i === 6,
    }));
  }, [scannedObjects]);

  // ── Category breakdown ────────────────────────────
  const categoryBreakdown = useMemo(() => {
    const counts = {};
    scannedObjects.forEach(s => {
      const cat = OBJ_CATEGORY[s.objectId];
      if (!cat) return;
      counts[cat.label] = (counts[cat.label] || { ...cat, count: 0 });
      counts[cat.label].count++;
    });

    const items  = Object.values(counts);
    const maxCnt = Math.max(...items.map(i => i.count), 1);
    return items
      .sort((a, b) => b.count - a.count)
      .map(item => ({ ...item, pct: Math.round((item.count / maxCnt) * 100) }));
  }, [scannedObjects]);

  // ── Badges ────────────────────────────────────────
  const earnedBadges = ACHIEVEMENTS.filter(a => badges.includes(a.id));
  const lockedBadges = ACHIEVEMENTS.filter(a => !badges.includes(a.id));

  const ICON_BG = {
    green:  'bg-green-light/15 text-green-light',
    teal:   'bg-teal-light/15 text-teal-light',
    gold:   'bg-[#f4a261]/15 text-[#f4a261]',
    purple: 'bg-[#9B72CF]/15 text-[#9B72CF]',
  };

  const STAT_CARDS = [
    { icon: 'fa-camera',   color: 'green',  label: 'Total Scan',   value: animScan },
    { icon: 'fa-wind',     color: 'teal',   label: 'CO₂ Dihemat',  value: `${(animCo2 / 10).toFixed(1)} kg` },
    { icon: 'fa-seedling', color: 'gold',   label: 'EcoPoints',    value: animPoints.toLocaleString('id-ID') },
    { icon: 'fa-trophy',   color: 'purple', label: 'Badge Diraih', value: `${animBadges}/${ACHIEVEMENTS.length}` },
  ];

  return (
    <div className="page-container" ref={ref}>
      <div className="page-header">
        <h2 className="page-title">Statistik <span className="gradient-text">Eco</span></h2>
        <p className="page-subtitle">Pantau dampak positifmu terhadap lingkungan</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="eco-card flex items-center gap-3 p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ICON_BG[card.color]}`}>
              <i className={`fa-solid ${card.icon} text-base`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-lg leading-none truncate">{card.value}</div>
              <div className="text-white/50 text-xs">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="eco-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm">Aktivitas 7 Hari Terakhir</h3>
          <div className="flex items-center gap-3 text-xs text-white/50">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-light" /> Scan</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-teal-light" /> CO₂</span>
          </div>
        </div>
        {scannedObjects.length > 0 ? (
          <div className="flex gap-1 items-end">
            {weeklyChart.map((d, i) => (
              <ChartBar key={d.day + i} {...d} delay={i * 80} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <i className="fa-solid fa-chart-bar text-white/10 text-3xl" />
            <p className="text-white/30 text-xs">Belum ada data scan minggu ini</p>
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">Koleksi Badge</h3>
        <span className="text-white/30 text-xs">{earnedBadges.length}/{ACHIEVEMENTS.length} unlocked</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        {/* Earned */}
        {earnedBadges.map(badge => (
          <div key={badge.id}
            className="eco-card flex flex-col items-center gap-1.5 py-3 px-2 text-center hover:border-green-light/30 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: `${badge.color}20`, color: badge.color }}>
              <i className={`fa-solid ${badge.icon}`} />
            </div>
            <span className="text-white/80 text-[9px] font-medium leading-tight">{badge.name}</span>
            <span className="text-green-light text-[9px] font-bold">Diraih ✓</span>
          </div>
        ))}

        {/* Locked */}
        {lockedBadges.map(badge => (
          <div key={badge.id}
            className="eco-card flex flex-col items-center gap-1.5 py-3 px-2 text-center opacity-35"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg text-white/20">
              <i className="fa-solid fa-lock text-sm" />
            </div>
            <span className="text-white/50 text-[9px] font-medium leading-tight">{badge.name}</span>
            <span className="text-white/30 text-[9px]">Terkunci</span>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="eco-card mb-6">
        <h3 className="text-white font-semibold text-sm mb-4">Scan per Kategori</h3>
        {categoryBreakdown.length > 0 ? (
          <div className="flex flex-col gap-3">
            {categoryBreakdown.map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-20 flex-shrink-0">
                  <i className={`fa-solid ${item.icon} text-xs`} style={{ color: item.color }} />
                  <span className="text-white/60 text-xs">{item.label}</span>
                </div>
                <AnimatedBar pct={item.pct} color={item.color} delay={i * 150} />
                <span className="text-white/50 text-xs w-14 text-right flex-shrink-0">{item.count} scan</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <i className="fa-solid fa-recycle text-white/10 text-3xl" />
            <p className="text-white/30 text-xs">Belum ada data kategori</p>
          </div>
        )}
      </div>

      {/* Level info */}
      <div className="eco-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">Progress Level</h3>
          <span className="text-green-light text-xs font-bold">Level {level}</span>
        </div>
        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-light to-teal-light transition-all duration-700"
            style={{ width: `${((ecoPoints % 500) / 500) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-white/30">
          <span>Level {level}</span>
          <span>{500 - (ecoPoints % 500)} EP lagi ke Level {level + 1}</span>
        </div>
      </div>
    </div>
  );
}