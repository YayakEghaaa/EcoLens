import { useState } from 'react';
import { RECYCLE_CARDS } from '../data/appData';

const CATS = [
  { key: 'all',     label: 'Semua' },
  { key: 'plastic', label: 'Plastik' },
  { key: 'paper',   label: 'Kertas' },
  { key: 'battery', label: 'Baterai' },
  { key: 'can',     label: 'Kaleng' },
];

const BADGE_STYLES = {
  recyclable: 'bg-green-light/20 text-green-light',
  hazardous:  'bg-[#f4a261]/20 text-[#f4a261]',
};

export default function RecyclePage() {
  const [activeCat, setActiveCat] = useState('all');

  const filtered = RECYCLE_CARDS.filter(c => activeCat === 'all' || c.cat === activeCat);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Panduan <span className="gradient-text">Daur Ulang</span></h2>
        <p className="page-subtitle">Pelajari cara mendaur ulang berbagai jenis sampah dengan benar</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 mb-6">
        {CATS.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCat(cat.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${activeCat === cat.key
                ? 'bg-green-light text-white'
                : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {filtered.map(card => (
          <div
            key={card.id}
            className="eco-card overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:border-green-light/25 p-0 animate-[fadeInUp_0.4s_ease_both]"
          >
            {/* Header */}
            <div className={`${card.headerClass} flex items-start justify-between p-4`}>
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white text-2xl">
                <i className={`fa-solid ${card.icon}`} />
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${BADGE_STYLES[card.badgeType]}`}>
                {card.badge}
              </span>
            </div>

            {/* Body */}
            <div className="p-4">
              <h3 className="text-white font-bold text-base mb-1">{card.title}</h3>
              <p className="text-white/50 text-xs mb-3">{card.desc}</p>

              {/* Steps */}
              <div className="flex flex-col gap-2 mb-4">
                {card.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-green-light/15 flex items-center justify-center text-green-light text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-white/60 text-xs leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>

              {/* Info Row */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <span className="flex items-center gap-1 text-white/50 text-xs">
                  <i className="fa-solid fa-clock text-green-light" /> {card.time}
                </span>
                <span className="flex items-center gap-1 text-white/50 text-xs">
                  <i className="fa-solid fa-wind text-teal-light" /> {card.carbon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
