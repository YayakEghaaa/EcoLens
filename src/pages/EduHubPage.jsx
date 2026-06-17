import { useState } from 'react';
import { DAILY_FACTS, ARTICLES, VIDEOS, TIPS } from '../data/appData';

const TAG_COLORS = {
  green:  'bg-green-light/15 text-green-light',
  teal:   'bg-teal-light/15 text-teal-light',
  gold:   'bg-[#f4a261]/15 text-[#f4a261]',
  purple: 'bg-[#9B72CF]/15 text-[#9B72CF]',
};

const TIP_ICON_COLORS = {
  green:  'bg-green-light/15 text-green-light',
  teal:   'bg-teal-light/15 text-teal-light',
  gold:   'bg-[#f4a261]/15 text-[#f4a261]',
  purple: 'bg-[#9B72CF]/15 text-[#9B72CF]',
};

// ── YouTube Modal ──────────────────────────────────────
function VideoModal({ video, onClose }) {
  if (!video) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#111A14] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Video embed */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="p-4 flex items-start justify-between gap-3">
          <div>
            <h4 className="text-white font-semibold text-sm leading-snug">{video.title}</h4>
            <span className="text-white/40 text-xs mt-1 block">
              <i className="fa-regular fa-eye mr-1" />{video.views} ditonton
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-all flex-shrink-0"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EduHubPage() {
  const [activeTab, setActiveTab]     = useState('articles');
  const [factIdx, setFactIdx]         = useState(0);
  const [factVisible, setFactVisible] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  const nextFact = () => {
    setFactVisible(false);
    setTimeout(() => {
      setFactIdx(i => (i + 1) % DAILY_FACTS.length);
      setFactVisible(true);
    }, 250);
  };

  const openArticle = (url) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Edu<span className="gradient-text">Hub</span></h2>
        <p className="page-subtitle">Perluas pengetahuan lingkunganmu</p>
      </div>

      {/* Daily Fact Banner */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-green-light/10 to-teal-light/10 border border-green-light/20 rounded-2xl p-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#f4a261]/15 flex items-center justify-center text-[#f4a261] flex-shrink-0">
          <i className="fa-solid fa-lightbulb" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-green-light text-[10px] font-bold uppercase tracking-wider">
            Fakta Hari Ini
          </span>
          <p
            className="text-white/70 text-xs leading-relaxed mt-0.5 fact-fade transition-opacity duration-250"
            style={{ opacity: factVisible ? 1 : 0 }}
          >
            {DAILY_FACTS[factIdx]}
          </p>
        </div>
        <button
          onClick={nextFact}
          className="w-8 h-8 rounded-xl bg-white/5 hover:bg-green-light/15 text-white/50 hover:text-green-light flex items-center justify-center transition-all duration-200 flex-shrink-0"
        >
          <i className="fa-solid fa-arrow-right text-xs" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
        {[
          { key: 'articles', label: 'Artikel' },
          { key: 'videos',   label: 'Video' },
          { key: 'tips',     label: 'Tips Hijau' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.key ? 'bg-green-light text-white' : 'text-white/50 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Articles Tab ── */}
      {activeTab === 'articles' && (
        <div className="flex flex-col gap-4">
          {/* Featured */}
          <div
            className="eco-card overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:border-green-light/25 p-0 cursor-pointer"
            onClick={() => openArticle(ARTICLES.featured.url)}
          >
            <div className="h-36 green-gradient flex items-center justify-center relative">
              <i className="fa-solid fa-earth-asia text-5xl text-white/50" />
              <span className="absolute top-3 right-3 bg-black/40 text-white/80 text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" /> Buka Artikel
              </span>
            </div>
            <div className="p-4">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${TAG_COLORS[ARTICLES.featured.tagClass]}`}>
                {ARTICLES.featured.tag}
              </span>
              <h3 className="text-white font-bold text-base mt-2 mb-1">{ARTICLES.featured.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed mb-3">{ARTICLES.featured.desc}</p>
              <div className="flex gap-4 text-white/40 text-xs">
                <span><i className="fa-regular fa-clock mr-1" />{ARTICLES.featured.readTime}</span>
                <span><i className="fa-regular fa-eye mr-1" />{ARTICLES.featured.views}</span>
              </div>
            </div>
          </div>

          {/* Small Grid */}
          <div className="grid grid-cols-2 gap-3">
            {ARTICLES.small.map((art, i) => (
              <div
                key={i}
                className="eco-card overflow-hidden hover:-translate-y-1 transition-all duration-300 hover:border-green-light/25 p-0 cursor-pointer"
                onClick={() => openArticle(art.url)}
              >
                <div className={`h-20 ${art.gradClass} flex items-center justify-center relative`}>
                  <i className={`fa-solid ${art.icon} text-3xl text-white/50`} />
                  <span className="absolute top-2 right-2 bg-black/30 text-white/70 text-[9px] px-1.5 py-0.5 rounded-full">
                    <i className="fa-solid fa-arrow-up-right-from-square text-[8px]" />
                  </span>
                </div>
                <div className="p-3">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${TAG_COLORS[art.tagClass]}`}>
                    {art.tag}
                  </span>
                  <h4 className="text-white text-xs font-semibold mt-1.5 leading-tight">{art.title}</h4>
                  <span className="text-white/40 text-[10px] mt-1 block">{art.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Videos Tab ── */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-2 gap-3">
          {VIDEOS.map((vid, i) => (
            <div
              key={i}
              className="eco-card overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:border-green-light/25 p-0"
              onClick={() => setActiveVideo(vid)}
            >
              {/* YouTube thumbnail */}
              <div className="h-28 relative overflow-hidden bg-black">
                <img
                  src={vid.thumb}
                  alt={vid.title}
                  className="w-full h-full object-cover opacity-80"
                  loading="lazy"
                  onError={e => { e.target.style.display = 'none'; }}
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-black/50 border border-white/30 flex items-center justify-center text-white hover:bg-red-600/80 transition-colors">
                    <i className="fa-solid fa-play text-sm ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {vid.duration}
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-white text-xs font-semibold leading-tight mb-2">{vid.title}</h4>
                <span className="text-white/40 text-[10px]">
                  <i className="fa-regular fa-eye mr-1" />{vid.views} ditonton
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tips Tab ── */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TIPS.map((tip, i) => (
            <div
              key={i}
              className="eco-card flex gap-3 hover:-translate-y-1 transition-all duration-300 hover:border-green-light/25 animate-[fadeInUp_0.4s_ease_both]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TIP_ICON_COLORS[tip.iconClass]}`}>
                <i className={`fa-solid ${tip.icon} text-base`} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">{tip.title}</h4>
                <p className="text-white/50 text-xs leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* YouTube Modal */}
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}