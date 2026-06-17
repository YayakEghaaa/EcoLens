# 🌿 EcoLens — React + Tailwind CSS

AR Education Platform untuk edukasi lingkungan. Dimigrasi dari vanilla HTML/CSS/JS ke React + Tailwind CSS.

---

## 📁 Struktur Folder

```
ecolens/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              # Entry point
    ├── App.jsx               # Root component & page router
    ├── index.css             # Tailwind directives + global styles
    │
    ├── context/
    │   └── AppContext.jsx    # Global state (currentPage, ecoPoints, toast)
    │
    ├── data/
    │   └── appData.js        # Semua data statis (objek scan, artikel, badge, dll)
    │
    ├── hooks/
    │   ├── useGreeting.js    # Dynamic greeting berdasarkan jam
    │   └── useCounter.js     # Animated counter hook untuk dashboard
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx    # Top navbar (desktop + mobile hamburger)
    │   │   ├── MobileNav.jsx # Side drawer navigation mobile
    │   │   └── BottomNav.jsx # Bottom tab bar mobile
    │   └── ui/
    │       ├── SplashScreen.jsx  # Loading splash screen
    │       └── Toast.jsx         # Notification toast
    │
    └── pages/
        ├── LandingPage.jsx   # Hero + Feature Cards + How It Works
        ├── HomePage.jsx      # Dashboard home (greeting, stats, challenge, activity)
        ├── ScanPage.jsx      # AR Scan simulator
        ├── RecyclePage.jsx   # Panduan daur ulang dengan filter kategori
        ├── DashboardPage.jsx # Statistik, chart, badge, breakdown
        └── EduHubPage.jsx    # Artikel, Video, Tips Hijau
```

---

## 🚀 Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Jalankan development server
```bash
npm run dev
```

### 3. Build untuk production
```bash
npm run build
```

---

## 🛠 Tech Stack

| Layer        | Tech                   |
|--------------|------------------------|
| Framework    | React 18 + Vite 5      |
| Styling      | Tailwind CSS v3        |
| State        | React Context + Hooks  |
| Icons        | Font Awesome 6         |
| Font         | Poppins (Google Fonts) |

---

## ✅ Fitur yang Dimigrasi

- ✅ Splash screen dengan loading bar
- ✅ Navigasi desktop, mobile drawer, bottom nav
- ✅ Landing page dengan hero, feature cards, how it works
- ✅ Home dashboard (greeting dinamis, stat cards, daily challenge, aktivitas)
- ✅ AR Scan simulator (pilih objek, scan, popup hasil)
- ✅ Panduan Daur Ulang dengan filter kategori
- ✅ Statistik dengan animated counter & chart
- ✅ Koleksi badge
- ✅ EduHub (Artikel, Video, Tips) dengan tabs
- ✅ Daily fact cycling
- ✅ Toast notifications
- ✅ EcoPoints state management
- ✅ Responsive di semua device
- ✅ Particle animation di landing
