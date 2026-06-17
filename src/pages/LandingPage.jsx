// LandingPage.jsx - Premium Redesign v2
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

/* ─── Data ─────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "fa-camera-rotate",
    color: "#52B788",
    title: "AR Real-time Scanner",
    desc: "Arahkan kamera ke objek sehari-hari dan dapatkan overlay informasi dampak lingkungan secara instan.",
    stat: "50+ Objek Terdeteksi",
  },
  {
    icon: "fa-chart-line",
    color: "#40BFB0",
    title: "Analisis Jejak Karbon",
    desc: "Visualisasi data karbon setiap objek dan panduan cara nyata untuk mengurangi emisimu.",
    stat: "Akurasi 95%+",
  },
  {
    icon: "fa-trophy",
    color: "#f4a261",
    title: "Gamifikasi EcoPoints",
    desc: "Kumpulkan poin dan raih badge eksklusif setiap kali kamu scan dan belajar tentang lingkungan.",
    stat: "30+ Badge Tersedia",
  },
  {
    icon: "fa-recycle",
    color: "#9B72CF",
    title: "Panduan Daur Ulang",
    desc: "Panduan step-by-step untuk mendaur ulang lebih dari 50 jenis sampah dengan benar dan efisien.",
    stat: "50+ Jenis Sampah",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "fa-camera",
    title: "Pindai Objek",
    desc: "Arahkan kamera ke objek sehari-hari seperti botol plastik, kertas, atau baterai.",
  },
  {
    step: "02",
    icon: "fa-microchip",
    title: "Analisis AR",
    desc: "AR overlay menampilkan data dampak lingkungan, waktu terurai, dan jejak karbon secara real-time.",
  },
  {
    step: "03",
    icon: "fa-star",
    title: "Raih Reward",
    desc: "Kumpulkan EcoPoints dan unlock badge eksklusif untuk setiap pencapaian hijaumu.",
  },
];

const STATS = [
  { value: "12.4K+", label: "Pengguna Aktif", icon: "fa-users", trend: "+22%" },
  { value: "98K+", label: "Total Scan", icon: "fa-camera", trend: "+15%" },
  {
    value: "4.9",
    label: "Rating",
    icon: "fa-star",
    suffix: "★",
    trend: "+0.3",
  },
  { value: "50+", label: "Jenis Sampah", icon: "fa-recycle", trend: "Baru" },
];

const BENEFITS = [
  {
    icon: "fa-earth-asia",
    color: "#52B788",
    title: "Dampak Nyata",
    desc: "Setiap scan yang kamu lakukan berkontribusi pada database edukasi lingkungan Indonesia.",
  },
  {
    icon: "fa-bolt",
    color: "#f4a261",
    title: "Instan & Akurat",
    desc: "Hasil analisis dalam hitungan detik dengan tingkat akurasi lebih dari 95%.",
  },
  {
    icon: "fa-shield-halved",
    color: "#40BFB0",
    title: "Data Terpercaya",
    desc: "Sumber data dari lembaga lingkungan dan peneliti terkemuka di Indonesia.",
  },
  {
    icon: "fa-users",
    color: "#9B72CF",
    title: "Komunitas Hijau",
    desc: "Bergabung dengan ribuan eco-hero yang berkomitmen menjaga kelestarian bumi.",
  },
  {
    icon: "fa-graduation-cap",
    color: "#52B788",
    title: "Belajar Sambil Main",
    desc: "Sistem gamifikasi membuat edukasi lingkungan terasa menyenangkan dan adiktif.",
  },
  {
    icon: "fa-chart-line",
    color: "#40BFB0",
    title: "Lacak Progresmu",
    desc: "Dashboard personal untuk memantau jejak karbon dan progres kontribusi lingkunganmu.",
  },
];

// Impact Stats untuk menggantikan Testimoni
const IMPACT_STATS = [
  {
    icon: "fa-trash-can",
    value: "2.4M+",
    label: "Sampah Teridentifikasi",
    desc: "Total objek yang telah terdeteksi dalam database",
    color: "#52B788",
  },
  {
    icon: "fa-cloud-sun",
    value: "850kg",
    label: "CO₂ Terselamatkan",
    desc: "Estimasi pengurangan emisi karbon",
    color: "#40BFB0",
  },
  {
    icon: "fa-leaf",
    value: "15K+",
    label: "EcoHero Aktif",
    desc: "Pengguna yang berkontribusi setiap hari",
    color: "#f4a261",
  },
];

const FAQS = [
  {
    q: "Apakah EcoLens gratis digunakan?",
    a: "Ya! EcoLens sepenuhnya gratis untuk didownload dan digunakan. Semua fitur inti termasuk AR Scanner, EcoPoints, dan Panduan Daur Ulang tersedia tanpa biaya.",
  },
  {
    q: "Objek apa saja yang bisa dipindai?",
    a: "EcoLens dapat mendeteksi lebih dari 50 jenis objek sehari-hari mulai dari plastik, kertas, baterai, kaleng, kaca, hingga elektronik. Database kami terus diperbarui.",
  },
  {
    q: "Bagaimana EcoPoints bisa ditukar?",
    a: "EcoPoints dapat digunakan untuk unlock badge eksklusif, akses konten premium, dan dalam update mendatang akan bisa ditukar dengan reward nyata dari mitra kami.",
  },
  {
    q: "Apakah data saya aman?",
    a: "Keamanan data pengguna adalah prioritas kami. Kami menggunakan enkripsi end-to-end dan tidak pernah menjual data pribadi kepada pihak ketiga.",
  },
  {
    q: "Apakah aplikasi ini tersedia di iOS dan Android?",
    a: "EcoLens tersedia di berbagai platform, bisa diakses via browser sebagai web app, maupun diunduh sebagai aplikasi native di iOS dan Android.",
  },
];

const MARQUEE_ITEMS = [
  "AR Scanner",
  "EcoPoints",
  "Daur Ulang",
  "Jejak Karbon",
  "Badge System",
  "Edukasi Lingkungan",
  "Go Green",
  "Indonesia",
  "Zero Waste",
  "Recycle",
];


/* ─── Shared Animation Variants ───────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};
const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ─── Hook: Scroll-triggered animation ─────────────── */
function useScrollAnim() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return [ref, inView];
}

/* ─── Canvas 2D Globe Component ───────────────────────── */
function CanvasGlobe() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Set canvas size with device pixel ratio for sharpness
    const setSize = () => {
      const container = canvas.parentElement;
      const size = Math.min(container.clientWidth, 380);
      canvas.width = size * 2;
      canvas.height = size * 2;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      return size;
    };

    let size = setSize();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let radius = size * 0.35;

    window.addEventListener("resize", () => {
      size = setSize();
      radius = size * 0.35;
    });

    // Earth gradient
    const earthGradients = {
      land: ["#2D6A4F", "#40916C", "#52B788", "#74C69D"],
      water: ["#1B4D6E", "#2A6F8F", "#3A8FB7", "#4A9FC7"],
      cloud: ["rgba(255,255,255,0.3)", "rgba(255,255,255,0.1)"],
    };

    // Trash/Recycle items positions (relative to globe)
    const items = [
      {
        type: "trash",
        angle: 0.8,
        radius: 1.45,
        icon: "fa-trash-can",
        color: "#EF4444",
        label: "Sampah Plastik",
      },
      {
        type: "recycle",
        angle: 2.2,
        radius: 1.55,
        icon: "fa-recycle",
        color: "#52B788",
        label: "Daur Ulang",
      },
      {
        type: "trash",
        angle: 3.8,
        radius: 1.4,
        icon: "fa-battery-full",
        color: "#f4a261",
        label: "Baterai",
      },
      {
        type: "leaf",
        angle: 5.0,
        radius: 1.5,
        icon: "fa-leaf",
        color: "#40BFB0",
        label: "Hijaukan Bumi",
      },
      {
        type: "recycle",
        angle: 6.2,
        radius: 1.48,
        icon: "fa-seedling",
        color: "#9B72CF",
        label: "Tumbuhan",
      },
    ];

    let animationId;
    let time = 0;
    let particleTime = 0;

    // Particle system
    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2 + 0.1,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;

      time += 0.008;
      particleTime += 0.01;
      rotationRef.current += 0.003;
      const rotation = rotationRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background glow
      const glowGrd = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.5,
        centerX,
        centerY,
        radius * 1.8,
      );
      glowGrd.addColorStop(0, "rgba(82,183,136,0.08)");
      glowGrd.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw orbiting ring
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY,
        radius * 1.2,
        radius * 0.95,
        0,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = "rgba(82,183,136,0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(
        centerX,
        centerY,
        radius * 1.6,
        radius * 1.25,
        0,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = "rgba(64,191,176,0.1)";
      ctx.stroke();
      ctx.restore();

      // Draw Earth shadow (3D effect)
      const shadowGrd = ctx.createLinearGradient(
        centerX - radius * 0.8,
        centerY - radius * 0.5,
        centerX + radius * 0.8,
        centerY + radius * 0.6,
      );
      shadowGrd.addColorStop(0, "rgba(0,0,0,0)");
      shadowGrd.addColorStop(0.5, "rgba(0,0,0,0.05)");
      shadowGrd.addColorStop(1, "rgba(0,0,0,0.25)");

      // Draw ocean base
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(82,183,136,0.2)";

      const oceanGrd = ctx.createRadialGradient(
        centerX - radius * 0.2,
        centerY - radius * 0.2,
        radius * 0.2,
        centerX,
        centerY,
        radius,
      );
      oceanGrd.addColorStop(0, earthGradients.water[1]);
      oceanGrd.addColorStop(1, earthGradients.water[0]);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = oceanGrd;
      ctx.fill();

      // Draw continents (rotating)
      const drawContinent = (offsetX, offsetY, scale, rotOffset, color) => {
        ctx.save();
        ctx.translate(
          centerX + Math.sin(rotation + rotOffset) * 6,
          centerY + Math.cos(rotation * 0.7 + rotOffset) * 4,
        );
        ctx.rotate(rotation * 0.5 + rotOffset);
        ctx.beginPath();

        // Random-looking continent shapes
        const points = [];
        for (let i = 0; i < 12; i++) {
          const ang = i * ((Math.PI * 2) / 12);
          const r =
            radius *
            scale *
            (0.7 +
              Math.sin(ang * 3 + rotOffset) * 0.1 +
              Math.cos(ang * 2) * 0.08);
          const x = offsetX + Math.cos(ang) * r;
          const y = offsetY + Math.sin(ang) * r * 0.9;
          points.push({ x, y });
        }
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
      };

      drawContinent(
        -radius * 0.35,
        -radius * 0.2,
        0.45,
        0,
        earthGradients.land[2],
      );
      drawContinent(
        radius * 0.3,
        -radius * 0.15,
        0.4,
        2.2,
        earthGradients.land[1],
      );
      drawContinent(
        -radius * 0.1,
        radius * 0.25,
        0.5,
        3.5,
        earthGradients.land[3],
      );
      drawContinent(
        radius * 0.4,
        radius * 0.3,
        0.35,
        4.8,
        earthGradients.land[0],
      );
      drawContinent(
        -radius * 0.45,
        radius * 0.1,
        0.38,
        6.0,
        earthGradients.land[1],
      );

      // Add highlight to earth
      ctx.beginPath();
      ctx.arc(
        centerX - radius * 0.25,
        centerY - radius * 0.3,
        radius * 0.25,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fill();

      // Earth outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(82,183,136,0.3)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = shadowGrd;
      ctx.fill();
      ctx.restore();

      // Draw orbiting items (trash, recycle, leaf)
      items.forEach((item, idx) => {
        const angle = item.angle + time * 0.5;
        const orbitRadius = radius * item.radius;
        const x = centerX + Math.cos(angle) * orbitRadius;
        const y = centerY + Math.sin(angle) * orbitRadius * 0.9;

        // Orbit line
        ctx.beginPath();
        ctx.moveTo(
          centerX + Math.cos(angle - 0.1) * orbitRadius,
          centerY + Math.sin(angle - 0.1) * orbitRadius * 0.9,
        );
        ctx.lineTo(
          centerX + Math.cos(angle + 0.1) * orbitRadius,
          centerY + Math.sin(angle + 0.1) * orbitRadius * 0.9,
        );
        ctx.strokeStyle = `${item.color}30`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw icon background circle
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.12, 0, Math.PI * 2);
        ctx.fillStyle = `${item.color}20`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.09, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();

        // Draw text label
        ctx.font = `bold ${Math.max(8, radius * 0.06)}px Poppins`;
        ctx.fillStyle = item.color;
        ctx.shadowBlur = 0;
        ctx.fillText(item.label, x - radius * 0.08, y - radius * 0.12);

        // Draw icon using Font Awesome (simplified)
        ctx.font = `${radius * 0.1}px "Font Awesome 6 Free"`;
        ctx.fillStyle = "#fff";
        ctx.shadowBlur = 0;
        let iconChar = ""; // default
        if (item.icon === "fa-trash-can") iconChar = "";
        else if (item.icon === "fa-recycle") iconChar = "";
        else if (item.icon === "fa-leaf") iconChar = "";
        else if (item.icon === "fa-battery-full") iconChar = "";
        else if (item.icon === "fa-seedling") iconChar = "";
        ctx.fillText(iconChar, x - radius * 0.045, y + radius * 0.035);
      });

      // Draw particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(82,183,136,${p.opacity + Math.sin(particleTime + p.x) * 0.1})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full max-w-[380px] h-auto rounded-full"
        style={{ filter: "drop-shadow(0 0 30px rgba(82,183,136,0.2))" }}
      />
      {/* Decorative ring gradient */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, transparent 60%, rgba(82,183,136,0.05) 100%)",
          filter: "blur(8px)",
        }}
      />
    </div>
  );
}

/* ─── Animated Counter ─────────────────────────────────── */
function AnimatedNumber({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const numeric = parseFloat(target.replace(/[^0-9.]/g, ""));
          const duration = 1600;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(eased * numeric * 10) / 10);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = target.includes(".")
    ? val.toFixed(1)
    : Math.round(val).toLocaleString();
  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ─── FAQ Item ─────────────────────────────────────────── */
function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`faq-item border border-[#1E2D22] rounded-xl overflow-hidden transition-all duration-300 ${
        open ? "bg-[#162019]" : "bg-transparent hover:bg-[#111A14]"
      }`}
    >
      <button
        className="w-full flex items-center justify-between gap-4 p-5 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span
          className={`text-sm font-medium transition-colors duration-200 ${
            open ? "text-white" : "text-white/60 group-hover:text-white"
          }`}
        >
          {q}
        </span>
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            open
              ? "bg-green-light/20 rotate-45"
              : "bg-white/5 group-hover:bg-white/10"
          }`}
        >
          <i
            className={`fa-solid fa-plus text-[10px] transition-colors ${
              open ? "text-green-light" : "text-white/40"
            }`}
          />
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-5 text-white/40 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

/* ─── Impact Card Component ────────────────────────────── */
function ImpactCard({ stat, index }) {
  return (
    <div
      className="feature-card group relative bg-[#111A14] border border-[#1E2D22] rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl reveal overflow-hidden"
      style={{ animationDelay: `${index * 0.1}s`, "--card-color": stat.color }}
    >
      <div className="card-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)`,
        }}
      />
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 relative z-10"
        style={{ background: `${stat.color}15`, color: stat.color }}
      >
        <i className={`fa-solid ${stat.icon} text-2xl`} />
      </div>
      <div className="text-3xl font-black gradient-text mb-1 relative z-10">
        <AnimatedNumber target={stat.value} />
      </div>
      <div className="text-white font-semibold text-sm mb-2 relative z-10">
        {stat.label}
      </div>
      <div className="text-white/30 text-xs relative z-10">{stat.desc}</div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────── */
export default function LandingPage() {
  const { navigate, user } = useApp();
  const particlesRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  // Redirect if logged in
  useEffect(() => {
    if (user) navigate("home");
  }, [user, navigate]);

  // Particles effect
  useEffect(() => {
    const container = particlesRef.current;
    if (!container || container.children.length > 0) return;

    const count = window.innerWidth < 768 ? 30 : 50;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 20}s;
        animation-duration: ${Math.random() * 15 + 10}s;
        opacity: ${Math.random() * 0.3 + 0.1};
        background: radial-gradient(circle, #52B788, transparent);
      `;
      container.appendChild(p);
    }
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleCTA = () => navigate(user ? "home" : "auth");
  const scrollToSection = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "#0A0F0D" }}
    >
      {/* Particles Background */}
      <div
        ref={particlesRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Ambient Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-[120px] transition-transform duration-1000"
          style={{
            background: "radial-gradient(circle, #52B788, transparent)",
            transform: `translate(${scrollY * 0.02}px, ${scrollY * 0.01}px)`,
          }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-[100px] transition-transform duration-1000"
          style={{
            background: "radial-gradient(circle, #40BFB0, transparent)",
            transform: `translate(${scrollY * -0.01}px, ${scrollY * -0.02}px)`,
          }}
        />
      </div>

      {/* ─── NAVBAR ─────────────────────────────────────── */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 ? "navbar-scrolled" : ""
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#52B788] to-[#40BFB0] animate-pulse opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="absolute inset-[2px] rounded-xl bg-[#0A0F0D]" />
              <i className="fa-solid fa-leaf relative z-10 text-green-light text-sm" />
            </div>
            <span className="gradient-text font-extrabold text-xl tracking-tight">
              EcoLens
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {["Fitur", "Cara Kerja", "Dampak", "FAQ"].map((label) => {
              const id =
                label === "Fitur"
                  ? "fitur"
                  : label === "Cara Kerja"
                    ? "cara-kerja"
                    : label === "Dampak"
                      ? "dampak"
                      : "faq";
              return (
                <button
                  key={label}
                  onClick={() => scrollToSection(id)}
                  className="text-white/40 hover:text-white text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCTA}
            className="btn-primary text-sm px-5 py-2.5 rounded-xl"
          >
            <i className="fa-solid fa-leaf text-xs mr-2" />
            Mulai Gratis
          </button>
        </div>
      </motion.nav>

      {/* ─── HERO SECTION - Text Left, Visual Right ──────── */}
      <section
        id="hero"
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column - Text Content (40% width on desktop) */}
          <div className="flex-1 lg:flex-[0.85] text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(82,183,136,0.1)",
                border: "1px solid rgba(82,183,136,0.25)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-light opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-light" />
              </span>
              AR Education Platform · Indonesia 🌱
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.15] mb-5">
              Pindai Dunia,
              <br />
              <span className="gradient-text">Selamatkan Bumi</span>
            </h1>

            <p className="text-white/40 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
              EcoLens mengubah cara kamu belajar tentang lingkungan. Gunakan
              teknologi AR untuk memindai objek sehari-hari dan temukan dampak
              nyatanya.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <button
                onClick={handleCTA}
                className="group btn-primary text-base px-8 py-3.5 rounded-xl font-bold inline-flex items-center gap-2"
              >
                <i className="fa-solid fa-leaf" />
                Mulai Petualanganmu
                <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => scrollToSection("fitur")}
                className="btn-ghost text-base px-8 py-3.5 rounded-xl font-bold"
              >
                <i className="fa-solid fa-play" /> Lihat Fitur
              </button>
            </div>

            {/* Mini stats under CTA */}
            <div className="flex items-center gap-6 justify-center lg:justify-start text-white/30 text-xs">
              <span>
                <i className="fa-regular fa-circle-check text-green-light mr-1" />
                Gratis Selamanya
              </span>
              <span>
                <i className="fa-regular fa-clock text-green-light mr-1" />
                Instan & Akurat
              </span>
              <span>
                <i className="fa-solid fa-chart-line text-green-light mr-1" />
                Update Berkala
              </span>
            </div>
          </div>

          {/* Right Column - Canvas 2D Globe (55% width on desktop) */}
          <div className="flex-1 lg:flex-[1.15] flex justify-center">
            <CanvasGlobe />
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ───────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card group text-center p-4 rounded-xl border border-[#1E2D22] cursor-default transition-all duration-300 hover:-translate-y-1 hover:border-green-light/25"
              style={{ background: "rgba(17,26,20,0.5)" }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <i
                  className={`fa-solid ${stat.icon} text-green-light text-sm transition-transform duration-300 group-hover:scale-125`}
                />
                <span className="text-xl font-black gradient-text">
                  <AnimatedNumber
                    target={stat.value}
                    suffix={stat.suffix || ""}
                  />
                </span>
              </div>
              <div className="text-white/40 text-[11px] font-medium">
                {stat.label}
              </div>
              <div className="text-[9px] text-green-light/50 mt-0.5">
                {stat.trend}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── MARQUEE ─────────────────────────────────────── */}
      <div className="relative z-10 overflow-hidden py-3 mb-16 border-y border-white/5">
        <div className="flex gap-10 whitespace-nowrap animate-marquee">
          {[...Array(3)]
            .fill(MARQUEE_ITEMS)
            .flat()
            .map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-2 text-sm font-medium text-white/20"
              >
                <span className="w-1 h-1 rounded-full bg-green-light/50" />
                {item}
              </span>
            ))}
        </div>
      </div>

      {/* ─── FEATURES SECTION ────────────────────────────── */}
      <section
        id="fitur"
        className="relative z-10 max-w-7xl mx-auto px-6 pb-28"
      >
        <div className="text-center mb-16 reveal">
          <span className="section-label justify-center">
            <i className="fa-solid fa-cube text-green-light" /> Fitur Unggulan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Teknologi AR untuk <span className="gradient-text">Edukasi</span>
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Semua yang kamu butuhkan untuk memahami dampak lingkungan dari
            aktivitas sehari-hari.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="feature-card group relative bg-[#111A14] border border-[#1E2D22] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl reveal overflow-hidden"
              style={{
                animationDelay: `${i * 0.08}s`,
                "--card-color": feature.color,
              }}
            >
              {/* Shimmer sweep on hover */}
              <div className="card-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              {/* Top border glow */}
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${feature.color}60, transparent)`,
                }}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 relative z-10"
                style={{
                  background: `${feature.color}15`,
                  color: feature.color,
                }}
              >
                <i className={`fa-solid ${feature.icon} text-xl`} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2 relative z-10">
                {feature.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-4 relative z-10">
                {feature.desc}
              </p>
              <div
                className="flex items-center gap-2 text-xs font-semibold relative z-10 transition-all duration-200 group-hover:gap-3"
                style={{ color: feature.color }}
              >
                <i className="fa-solid fa-circle-check" />
                <span>{feature.stat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────── */}
      <section
        id="cara-kerja"
        className="relative z-10 max-w-7xl mx-auto px-6 pb-28"
      >
        <div className="text-center mb-16 reveal">
          <span className="section-label justify-center">
            <i className="fa-solid fa-compass text-green-light" /> Cara Kerja
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Tiga Langkah <span className="gradient-text">Mudah</span>
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Mulai perjalanan hijaumu dalam hitungan detik.
          </p>
        </div>

        <div className="relative">
          {/* Progress Line */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-px bg-gradient-to-r from-green-light/0 via-green-light/30 to-green-light/0" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                className="relative text-center group"
                variants={fadeUp}
              >
                <div className="relative mb-5 flex justify-center">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-xl relative z-10 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${i === 0 ? "#52B788" : i === 1 ? "#40BFB0" : "#f4a261"}15, transparent)`,
                      border: `2px solid ${i === 0 ? "#52B788" : i === 1 ? "#40BFB0" : "#f4a261"}40`,
                      color:
                        i === 0 ? "#52B788" : i === 1 ? "#40BFB0" : "#f4a261",
                    }}
                  >
                    <i className={`fa-solid ${step.icon}`} />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                    style={{
                      background:
                        i === 0 ? "#52B788" : i === 1 ? "#40BFB0" : "#f4a261",
                    }}
                  >
                    {i + 1}
                  </div>
                </div>
                <h4 className="text-white font-black text-base mb-2">
                  {step.title}
                </h4>
                <p className="text-white/40 text-xs leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── BENEFITS SECTION ────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <div className="text-center mb-16 reveal">
          <span className="section-label justify-center">
            <i className="fa-solid fa-heart text-green-light" /> Mengapa
            EcoLens?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Lebih dari Sekadar <span className="gradient-text">Scanner</span>
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            EcoLens dirancang untuk menjadi teman hijau kamu sehari-hari —
            edukatif, menyenangkan, dan berdampak nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map((benefit, i) => (
            <div
              key={benefit.title}
              className="feature-card group relative bg-[#111A14] border border-[#1E2D22] rounded-2xl p-5 flex gap-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl reveal overflow-hidden"
              style={{
                animationDelay: `${i * 0.05}s`,
                "--card-color": benefit.color,
              }}
            >
              <div className="card-shimmer absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div
                className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${benefit.color}50, transparent)`,
                }}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 relative z-10"
                style={{
                  background: `${benefit.color}15`,
                  color: benefit.color,
                }}
              >
                <i className={`fa-solid ${benefit.icon}`} />
              </div>
              <div className="relative z-10">
                <h4 className="text-white font-bold text-sm mb-1">
                  {benefit.title}
                </h4>
                <p className="text-white/40 text-[11px] leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── IMPACT STATS SECTION (Pengganti Testimoni) ──── */}
      <section
        id="dampak"
        className="relative z-10 max-w-7xl mx-auto px-6 pb-28"
      >
        <div className="text-center mb-12 reveal">
          <span className="section-label justify-center">
            <i className="fa-solid fa-chart-line text-green-light" /> Dampak
            yang Diciptakan
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            <span className="gradient-text">Bersama</span> Menjaga Bumi
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            Setiap scan yang kamu lakukan berkontribusi pada database edukasi
            lingkungan Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {IMPACT_STATS.map((stat, i) => (
            <ImpactCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Small note */}
        <p className="text-center text-white/20 text-[10px] mt-6">
          *Data berdasarkan proyeksi dan kontribusi pengguna EcoLens
        </p>
      </section>

      {/* ─── FAQ SECTION ─────────────────────────────────── */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-6 pb-28">
        <div className="text-center mb-12 reveal">
          <span className="section-label justify-center">
            <i className="fa-regular fa-circle-question text-green-light" /> FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ada <span className="gradient-text">Pertanyaan</span>?
          </h2>
          <p className="text-white/40 text-sm">
            Jawaban untuk hal-hal yang sering ditanyakan.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ────────────────────────────── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(82,183,136,0.08), rgba(64,191,176,0.04))",
            border: "1px solid rgba(82,183,136,0.2)",
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div
            className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20"
            style={{
              background: "radial-gradient(circle, #52B788, transparent)",
            }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-15"
            style={{
              background: "radial-gradient(circle, #40BFB0, transparent)",
            }}
          />

          <motion.div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-semibold"
              style={{
                background: "rgba(82,183,136,0.12)",
                border: "1px solid rgba(82,183,136,0.25)",
              }}
            >
              <i className="fa-solid fa-rocket text-xs text-green-light" />
              Mulai Sekarang · 100% Gratis
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              Siap jadi <span className="gradient-text">EcoHero</span>?
            </h2>

            <p className="text-white/45 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Bergabung bersama ribuan pengguna yang sudah menggunakan EcoLens
              untuk memahami dan mengurangi dampak lingkungan mereka.
            </p>

            <motion.button
              onClick={handleCTA}
              className="group btn-primary text-base px-10 py-3.5 rounded-xl font-bold inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-leaf" />
              Mulai Sekarang
              <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>

            <p className="text-white/20 text-[10px] mt-4">
              <i className="fa-regular fa-circle-check mr-1" />
              Tidak perlu kartu kredit · Langsung bisa digunakan
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="relative z-10 overflow-hidden">
        {/* Top glow divider */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(82,183,136,0.3) 30%, rgba(64,191,176,0.3) 70%, transparent)",
          }}
        />

        {/* Ambient glow behind footer */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full blur-[100px] opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, #52B788, transparent)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-8">
          {/* Top row: Brand + tagline | Nav columns | Social */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Brand column */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("hero")}
                className="flex items-center gap-2.5 group w-fit"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-110">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#52B788] to-[#40BFB0]" />
                  <div className="absolute inset-[2px] rounded-xl bg-[#0D1610]" />
                  <i className="fa-solid fa-leaf relative z-10 text-green-light text-sm" />
                </div>
                <span className="gradient-text font-extrabold text-xl tracking-tight">
                  EcoLens
                </span>
              </button>
              <p className="text-white/25 text-xs leading-relaxed max-w-[220px]">
                Platform edukasi lingkungan berbasis AR untuk generasi hijau
                Indonesia.
              </p>
              {/* Social icons */}
              <div className="flex gap-2 mt-1">
                {[
                  { id: "instagram", color: "#E1306C" },
                  { id: "twitter", color: "#1DA1F2" },
                  { id: "tiktok", color: "#69C9D0" },
                  { id: "youtube", color: "#FF0000" },
                ].map(({ id, color }) => (
                  <a
                    key={id}
                    href="#"
                    className="footer-social w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all duration-300"
                    style={{ "--social-color": color }}
                  >
                    <i className={`fa-brands fa-${id}`} />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav links */}
            <div className="flex flex-col gap-3">
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">
                Navigasi
              </p>
              {[
                { label: "Fitur Unggulan", id: "fitur", icon: "fa-cube" },
                { label: "Cara Kerja", id: "cara-kerja", icon: "fa-compass" },
                { label: "Dampak", id: "dampak", icon: "fa-chart-line" },
                { label: "FAQ", id: "faq", icon: "fa-circle-question" },
              ].map(({ label, id, icon }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="footer-nav-link flex items-center gap-2 text-white/30 text-xs w-fit transition-all duration-200"
                >
                  <i className={`fa-solid ${icon} text-[10px]`} />
                  {label}
                </button>
              ))}
            </div>

            {/* Newsletter / CTA mini */}
            <div className="flex flex-col gap-3">
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">
                Mulai Sekarang
              </p>
              <p className="text-white/25 text-xs leading-relaxed">
                Bergabung dan jadilah bagian dari gerakan EcoHero Indonesia.
              </p>
              <button
                onClick={handleCTA}
                className="footer-cta-btn group mt-1 w-fit flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all duration-300"
              >
                <i className="fa-solid fa-leaf text-[10px]" />
                Coba EcoLens Gratis
                <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <div className="flex items-center gap-2 text-[10px] text-white/20 mt-1">
                <i className="fa-regular fa-circle-check text-green-light/50" />
                Tidak perlu kartu kredit
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <p className="text-white/15 text-[10px]">
              © 2025 EcoLens · Dibuat dengan{" "}
              <span className="text-green-light/40">♥</span> untuk bumi
              Indonesia
            </p>
            <div className="flex items-center gap-4">
              <span className="text-white/15 text-[10px] hover:text-white/30 cursor-pointer transition-colors">
                Privasi
              </span>
              <span className="text-white/15 text-[10px] hover:text-white/30 cursor-pointer transition-colors">
                Ketentuan
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 22s linear infinite;
          width: fit-content;
        }
        
        .reveal {
          opacity: 0;
          transform: translateY(25px);
          transition: opacity 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        
        .navbar-scrolled {
          background: rgba(10, 15, 13, 0.95) !important;
          backdrop-filter: blur(12px) !important;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        }
        
        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #52B788;
          margin-bottom: 12px;
        }

        /* ── Card shimmer sweep effect ── */
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .card-shimmer {
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(var(--card-color-rgb, 82,183,136), 0.04) 50%,
            rgba(255,255,255,0.05) 55%,
            transparent 65%
          );
          animation: shimmer-sweep 1.4s ease-in-out infinite;
        }
        .feature-card:hover {
          border-color: color-mix(in srgb, var(--card-color, #52B788) 30%, transparent) !important;
          box-shadow: 0 20px 40px -10px color-mix(in srgb, var(--card-color, #52B788) 15%, transparent);
        }

        /* ── Stat card glow ── */
        .stat-card:hover {
          box-shadow: 0 8px 24px -6px rgba(82,183,136,0.12);
        }

        /* ── FAQ item hover ── */
        .faq-item {
          transition: border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        .faq-item:hover {
          border-color: rgba(82,183,136,0.25) !important;
          box-shadow: 0 4px 20px -4px rgba(82,183,136,0.1);
        }

        /* ── Footer social icons ── */
        .footer-social {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.3);
          position: relative;
          overflow: hidden;
        }
        .footer-social::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--social-color, #52B788);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: inherit;
        }
        .footer-social:hover::before { opacity: 0.15; }
        .footer-social:hover {
          color: var(--social-color, #52B788);
          transform: translateY(-2px) scale(1.1);
          box-shadow: 0 4px 12px -2px color-mix(in srgb, var(--social-color, #52B788) 40%, transparent);
        }

        /* ── Footer nav link ── */
        .footer-nav-link {
          position: relative;
        }
        .footer-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #52B788;
          transition: width 0.25s ease;
        }
        .footer-nav-link:hover {
          color: rgba(255,255,255,0.7);
        }
        .footer-nav-link:hover::after {
          width: 100%;
        }
        .footer-nav-link i {
          transition: transform 0.2s ease, color 0.2s ease;
          color: rgba(82,183,136,0.4);
        }
        .footer-nav-link:hover i {
          transform: translateX(2px);
          color: #52B788;
        }

        /* ── Footer CTA button ── */
        .footer-cta-btn {
          background: rgba(82,183,136,0.08);
          border: 1px solid rgba(82,183,136,0.2);
          position: relative;
          overflow: hidden;
        }
        .footer-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(82,183,136,0.12), rgba(64,191,176,0.08));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .footer-cta-btn:hover::before { opacity: 1; }
        .footer-cta-btn:hover {
          border-color: rgba(82,183,136,0.4);
          transform: translateY(-1px);
          box-shadow: 0 8px 20px -4px rgba(82,183,136,0.2);
        }

        /* ── Btn-primary shimmer ── */
        .btn-primary {
          position: relative;
          overflow: hidden;
        }
        .btn-primary::after {
          content: '';
          position: absolute;
          top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: skewX(-15deg);
          transition: left 0.5s ease;
        }
        .btn-primary:hover::after {
          left: 140%;
        }
      `}</style>
    </div>
  );
}