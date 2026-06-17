import { useEffect, useRef, useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { SCAN_OBJECTS } from "../data/appData";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// ── Marker config ───────────────────────────────────
const MARKERS = [
  { index: 0, objectId: "plastic",      label: "Botol Plastik",   icon: "fa-bottle-water",  glb: "/assets/models/BotolPlastik.glb"   },
  { index: 1, objectId: "can",          label: "Kaleng",          icon: "fa-cube",           glb: "/assets/models/Kaleng.glb"         },
  { index: 2, objectId: "paper",        label: "Kertas / Koran",  icon: "fa-newspaper",     glb: "/assets/models/Koran.glb"          },
  { index: 3, objectId: "battery",      label: "Baterai",         icon: "fa-battery-full",  glb: "/assets/models/Baterai.glb"        },
  { index: 4, objectId: "plastic_bag",  label: "Kantong Plastik", icon: "fa-bag-shopping",  glb: "/assets/models/KantongPlastik.glb" },
  { index: 5, objectId: "cardboard",    label: "Kardus",          icon: "fa-box",           glb: "/assets/models/Kardus.glb"         },
  { index: 6, objectId: "glass",        label: "Botol Kaca",      icon: "fa-wine-bottle",   glb: "/assets/models/BotolKaca.glb"      },
  { index: 7, objectId: "styrofoam",    label: "Styrofoam",       icon: "fa-box-open",      glb: "/assets/models/Styrofoam.glb"      },
  { index: 8, objectId: "tisu",         label: "Tisu",            icon: "fa-scroll",        glb: "/assets/models/Tisu.glb"           },
  { index: 9, objectId: "sisa_makanan", label: "Sisa Makanan",    icon: "fa-utensils",      glb: "/assets/models/SisaMakanan.glb"    },
];

const OBJ_COLOR = {
  plastic:      0x52b788,
  battery:      0xef4444,
  glass:        0x9b72cf,
  can:          0xf4a261,
  plastic_bag:  0x40bfb0,
  cardboard:    0xf59e0b,
  paper:        0x60a5fa,
  tisu:         0xa78bfa,
  styrofoam:    0x94a3b8,
  sisa_makanan: 0x84cc16,
};

// ── Trash categories ─────────────────────────────────
// Untuk fitur drag ke tempat sampah
const TRASH_CATEGORY = {
  plastic:      "anorganik",
  can:          "anorganik",
  paper:        "anorganik",
  battery:      "anorganik",
  plastic_bag:  "anorganik",
  cardboard:    "anorganik",
  glass:        "anorganik",
  styrofoam:    "anorganik",
  tisu:         "anorganik",
  sisa_makanan: "organik",
};

const EXTRA_OBJECTS = {
  glass: {
    name: "Botol Kaca",
    icon: "fa-wine-bottle",
    impactScore: 3,
    impactLabel: "Sedang",
    decomposeTime: "1 Juta Tahun",
    carbon: "55g CO₂",
    carbonPct: 55,
    fact: "Botol kaca butuh waktu sangat lama untuk terurai, namun bisa didaur ulang tanpa batas.",
    points: 25,
  },
  plastic_bag: {
    name: "Kantong Plastik",
    icon: "fa-bag-shopping",
    impactScore: 4,
    impactLabel: "Tinggi",
    decomposeTime: "20 Tahun",
    carbon: "48g CO₂",
    carbonPct: 48,
    fact: "Kantong plastik sering berakhir di lautan dan membahayakan kehidupan laut.",
    points: 10,
  },
  cardboard: {
    name: "Kardus",
    icon: "fa-box",
    impactScore: 1,
    impactLabel: "Rendah",
    decomposeTime: "2 Bulan",
    carbon: "15g CO₂",
    carbonPct: 15,
    fact: "Kardus adalah salah satu material paling mudah dan efisien untuk didaur ulang.",
    points: 10,
  },
};

// ── Fallback 3D object (sphere + rings) ────────────
function createFallback3D(objectId) {
  const color = OBJ_COLOR[objectId] || 0x52b788;
  const group = new THREE.Group();
  const sphereGeo = new THREE.SphereGeometry(0.12, 32, 32);
  const sphereMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.6,
    roughness: 0.3,
    metalness: 0.7,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  group.add(sphere);
  const ring1Geo = new THREE.TorusGeometry(0.22, 0.012, 16, 100);
  const ring1Mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.4,
  });
  const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
  ring1.rotation.x = Math.PI / 2;
  group.add(ring1);
  const ring2Geo = new THREE.TorusGeometry(0.3, 0.008, 16, 100);
  const ring2Mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.7,
  });
  const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.y = Math.PI / 6;
  group.add(ring2);
  const pCount = 40;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const a = (i / pCount) * Math.PI * 2;
    const r = 0.35 + Math.random() * 0.15;
    pPos[i * 3] = Math.cos(a) * r;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
    pPos[i * 3 + 2] = Math.sin(a) * r;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({
    color,
    size: 0.015,
    transparent: true,
    opacity: 0.8,
  });
  const particles = new THREE.Points(pGeo, pMat);
  group.add(particles);
  return {
    group,
    sphere,
    ring1,
    ring2,
    particles,
    sphereMat,
    ring1Mat,
    isGLB: false,
  };
}

// ── DRACOLoader instance (reuse satu instance untuk semua load) ──
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
dracoLoader.preload();

// ── Load GLB model ──────────────────────────────────
function loadGLBModel(path, objectId) {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;

        // Auto scale model biar fit di marker
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 0.5 / maxDim;
        model.scale.setScalar(scale);

        // Center model
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center.multiplyScalar(scale));

        // Wrap in group
        const group = new THREE.Group();
        group.add(model);
        group.scale.setScalar(0); // Start invisible (scale-in animation)

        // Setup AnimationMixer jika GLB punya animasi built-in dari Blender
        let mixer = null;
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
          });
        }

        resolve({ group, model, isGLB: true, mixer });
      },
      undefined,
      (err) => {
        console.warn(`GLB load failed for ${path}:`, err);
        resolve(createFallback3D(objectId)); // Fallback ke sphere
      },
    );
  });
}

// ── Particle burst effect ───────────────────────────
function createParticleBurst(scene, position, color) {
  const count = 30;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const vel = [];
  for (let i = 0; i < count; i++) {
    pos[i * 3] = position.x;
    pos[i * 3 + 1] = position.y;
    pos[i * 3 + 2] = position.z;
    vel.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        Math.random() * 0.05,
        (Math.random() - 0.5) * 0.05,
      ),
    );
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color,
    size: 0.02,
    transparent: true,
    opacity: 1,
  });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);
  return { particles, vel, life: 1.0 };
}

export default function ScanPage() {
  const { navigate, addPoints, showToast } = useApp();
  const containerRef = useRef(null);
  const mindarRef = useRef(null);
  const rendererRef = useRef(null);
  const burstRef = useRef([]);
  const isDragging = useRef(false);
  const lastTouch = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef(0);
  const modelRefs = useRef({});
  // Track marker yang sedang aktif secara synchronous — tidak bergantung React state
  const activeMarkerIdRef = useRef(null);
  // Track marker yang sudah dapat points — TIDAK pernah direset selama session
  const pointsGivenRef = useRef(new Set());
  // Simpan data result terakhir per marker — supaya bisa dibuka lagi setelah close
  const savedResultRef = useRef({});

  const [arError, setArError] = useState(null);
  const [detected, setDetected] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultExpanded, setResultExpanded] = useState(false);

  // ── Trash feature states ─────────────────────────────
  const [showTrash, setShowTrash] = useState(false);
  const [trashFeedback, setTrashFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [trashSolved, setTrashSolved] = useState(false);    // sudah berhasil sort
  const trashSolvedRef = useRef(new Set());                  // track per session
  const trashLeftRef = useRef(null);    // ref ke div trash kiri (organik)
  const trashRightRef = useRef(null);   // ref ke div trash kanan (anorganik)
  const trashTimeoutRef = useRef(null); // track timeout showTrash supaya bisa di-cancel
  const [detectedId, setDetectedId] = useState(null);
  const [activeMarker, setActiveMarker] = useState(MARKERS[0]);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    let mindarThree = null;

    const initAR = async () => {
      try {
        // ── Mulai download GLB SEKARANG, paralel dengan semua inisialisasi ──
        // Tidak perlu tunggu MindAR atau start() — manfaatkan waktu loading semaksimal mungkin
        const glbPromises = {};
        MARKERS.forEach((marker) => {
          if (marker.glb) {
            glbPromises[marker.objectId] = loadGLBModel(marker.glb, marker.objectId);
          }
        });

        mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: "/assets/markers/targets.mind",
          uiLoading: "no",
          uiScanning: "no",
          uiError: "no",
          filterMinCF: 0.001,
          filterBeta: 0.001,
          missTolerance: 3,
          warmupTolerance: 1,
        });

        mindarRef.current = mindarThree;
        const { renderer, scene, camera } = mindarThree;
        rendererRef.current = renderer;

        // Lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(1, 2, 1);
        scene.add(dirLight);
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 3);
        pointLight.position.set(0, 1, 1);
        scene.add(pointLight);

        // Setup anchor dengan fallback 3D — GLB sudah loading di background sejak tadi
        const anchorRefs = {};
        const glbReady = {};

        MARKERS.forEach((marker, i) => {
          const anchor = mindarThree.addAnchor(marker.index);
          const obj3D = createFallback3D(marker.objectId);
          // Fallback selalu mulai hidden — tidak akan diperlihatkan kalau GLB sudah ready
          obj3D.group.scale.setScalar(0);
          modelRefs.current[marker.objectId] = obj3D;
          anchor.group.add(obj3D.group);
          anchorRefs[marker.objectId] = anchor;
          glbReady[marker.objectId] = !marker.glb;

          anchor.onTargetFound = () => {
            // Sync ref dulu — lebih cepat dari React state update
            activeMarkerIdRef.current = marker.objectId;

            // Sembunyikan SEMUA object lain secara synchronous
            // Ini cegah object lama stack di atas object baru
            MARKERS.forEach((m) => {
              if (m.objectId !== marker.objectId) {
                const other = modelRefs.current[m.objectId];
                if (other) {
                  other.group.scale.setScalar(0);
                  other._scaleIn = false;
                }
              }
            });

            // Update React state
            setDetected(true);
            setDetectedId(marker.objectId);
            setActiveMarker(marker);
            setShowControls(true);
            setResultExpanded(false);
            // Cancel pending showTrash timeout dari marker sebelumnya
            if (trashTimeoutRef.current) {
              clearTimeout(trashTimeoutRef.current);
              trashTimeoutRef.current = null;
            }
            if (trashTimeoutRef.current) {
              clearTimeout(trashTimeoutRef.current);
              trashTimeoutRef.current = null;
            }
            setShowTrash(false);
            setTrashFeedback(null);
            // Reset trashSolved berdasarkan marker baru
            setTrashSolved(trashSolvedRef.current.has(marker.objectId));

            const saved = savedResultRef.current[marker.objectId];
            setResult(saved || null);

            // Scale-in object ini
            const current3D = modelRefs.current[marker.objectId];
            current3D.group.scale.setScalar(0);
            if (glbReady[marker.objectId]) {
              current3D._scaleIn = true;
            }

            const burst = createParticleBurst(
              scene,
              new THREE.Vector3(0, 0, 0),
              OBJ_COLOR[marker.objectId] || 0x52b788,
            );
            burstRef.current.push(burst);
          };

          anchor.onTargetLost = () => {
            // Hanya reset UI kalau marker yang lost memang yang sedang aktif
            // Kalau tidak, berarti marker lain sudah onTargetFound duluan — jangan override
            if (activeMarkerIdRef.current !== marker.objectId) return;

            activeMarkerIdRef.current = null;
            const current3D = modelRefs.current[marker.objectId];
            if (current3D) {
              current3D.group.scale.setScalar(0);
              current3D._scaleIn = false;
            }

            setDetected(false);
            setDetectedId(null);
            setResult(null);
            setResultExpanded(false);
            setShowControls(false);
            if (trashTimeoutRef.current) {
              clearTimeout(trashTimeoutRef.current);
              trashTimeoutRef.current = null;
            }
            setShowTrash(false);
            setTrashFeedback(null);
          };
        });

        // Start AR — kamera langsung aktif, fallback 3D sudah terpasang
        await mindarThree.start();
        setLoading(false);

        // Swap fallback → GLB di background setelah kamera sudah aktif
        MARKERS.forEach((marker) => {
          if (!glbPromises[marker.objectId]) return;
          glbPromises[marker.objectId].then((glbObj3D) => {
            const anchor = anchorRefs[marker.objectId];
            const placeholder = modelRefs.current[marker.objectId];
            // Pastikan fallback benar-benar hidden sebelum swap
            placeholder.group.scale.setScalar(0);
            placeholder._scaleIn = false;
            anchor.group.remove(placeholder.group);
            anchor.group.add(glbObj3D.group);
            glbObj3D.group.scale.setScalar(0);
            modelRefs.current[marker.objectId] = glbObj3D;
            glbReady[marker.objectId] = true;

            // Scale-in hanya kalau marker ini memang yang sedang aktif saat GLB tiba
            // Pakai activeMarkerIdRef — lebih reliable dari anchor.group.visible
            if (activeMarkerIdRef.current === marker.objectId) {
              glbObj3D._scaleIn = true;
            }
          });
        });

        // ── Animasi per-object sesuai sifat sampah ──────
        // Setiap object punya karakter animasi unik yang mencerminkan sifat fisiknya
        const ANIM = {
          // Botol Plastik — melayang di air laut, berputar pelan
          plastic: (g, t) => {
            g.position.y = Math.sin(t * 0.8) * 0.06;
            g.rotation.y += 0.006;
            g.rotation.z = Math.sin(t * 0.5) * 0.05; // slight tilt seperti mengapung
          },
          // Baterai — pulse berbahaya, getaran kecil (simulasi "panas/bahaya")
          battery: (g, t) => {
            const pulse = 1 + Math.sin(t * 4) * 0.04;
            g.scale.setScalar(g.scale.x > 0.5 ? pulse : g.scale.x); // pulse hanya saat sudah muncul
            g.rotation.y += 0.005;
            g.position.x = Math.sin(t * 12) * 0.008; // getaran kecil
            g.position.z = Math.cos(t * 12) * 0.008;
          },
          // Botol Kaca — berat, stabil, rotate pelan, slight sway
          glass: (g, t) => {
            g.position.y = Math.sin(t * 0.6) * 0.025; // float sangat pelan (berat)
            g.rotation.y += 0.004;
            g.rotation.z = Math.sin(t * 0.4) * 0.02; // sway minimal
          },
          // Kaleng — menggelinding, rotate cepat di axis Z
          can: (g, t) => {
            g.rotation.z = Math.sin(t * 1.5) * 0.15; // rolling kanan-kiri
            g.rotation.y += 0.01;
            g.position.y = Math.abs(Math.sin(t * 1.5)) * 0.02; // bounce kecil saat rolling
          },
          // Kantong Plastik — tertiup angin, wave/flutter
          plastic_bag: (g, t) => {
            g.rotation.y += 0.005;
            g.rotation.z = Math.sin(t * 2) * 0.12;   // flutter kanan-kiri
            g.rotation.x = Math.sin(t * 1.5) * 0.08; // flutter depan-belakang
            g.position.y = Math.sin(t * 1.8) * 0.05; // terbawa angin naik turun
          },
          // Kardus — ringan, float pelan, slight wobble
          cardboard: (g, t) => {
            g.position.y = Math.sin(t * 1.0) * 0.04;
            g.rotation.y += 0.005;
            g.rotation.x = Math.sin(t * 0.7) * 0.04; // slight tip (kardus tidak stabil)
          },
          // Koran — kertas tertiup angin, flutter lebih aktif
          paper: (g, t) => {
            g.rotation.y += 0.007;
            g.rotation.z = Math.sin(t * 2.5) * 0.1;  // flutter
            g.rotation.x = Math.sin(t * 2.0) * 0.07;
            g.position.y = Math.sin(t * 2.2) * 0.045; // naik turun seperti kertas jatuh
          },
          // Tisu — sangat ringan, melayang lambat, hampir seperti bulu
          tisu: (g, t) => {
            g.position.y = Math.sin(t * 0.7) * 0.07; // float tinggi
            g.rotation.y += 0.004;
            g.rotation.z = Math.sin(t * 1.2) * 0.08; // melayang miring
            g.rotation.x = Math.sin(t * 0.9) * 0.06;
          },
          // Styrofoam — sangat ringan, bouncy, memantul
          styrofoam: (g, t) => {
            g.position.y = Math.abs(Math.sin(t * 1.8)) * 0.08; // bounce (selalu positif)
            g.rotation.y += 0.008;
            const bouncePulse = 1 + Math.sin(t * 3.6) * 0.03;
            if (g.scale.x > 0.5) g.scale.setScalar(bouncePulse);
          },
          // Sisa Makanan — membusuk, bergetar kecil, rotate tidak teratur
          sisa_makanan: (g, t) => {
            g.position.y = Math.sin(t * 1.1) * 0.03;
            g.rotation.y += 0.006;
            g.rotation.x = Math.sin(t * 3) * 0.03;   // getar tidak teratur
            g.rotation.z = Math.cos(t * 2.7) * 0.03; // simulate decomposing movement
          },
        };

        // ── Animation loop ──────────────────────────
        const clock = new THREE.Clock();
        renderer.setAnimationLoop(() => {
          const t = clock.getElapsedTime();
          const delta = clock.getDelta?.() ?? 0.016;

          MARKERS.forEach((marker) => {
            const obj3D = modelRefs.current[marker.objectId];
            const g = obj3D.group;

            // Scale-in saat marker pertama terdeteksi
            if (obj3D._scaleIn) {
              const current = g.scale.x;
              const newScale = current + (1 - current) * 0.28;
              g.scale.setScalar(newScale);
              if (newScale > 0.98) {
                g.scale.setScalar(1);
                obj3D._scaleIn = false;
              }
              return; // skip animasi lain saat scale-in
            }

            // Hanya animasi object yang sedang visible (scale > 0)
            if (g.scale.x < 0.05) return;

            // Animasi karakteristik per object
            // Jika user sedang drag, skip rotation agar tidak conflict
            if (!isDragging.current) {
              const animFn = ANIM[marker.objectId];
              if (animFn) animFn(g, t);
            } else {
              // Saat drag: tetap float, hanya skip rotation
              g.position.y = Math.sin(t * 1.0) * 0.04;
            }

            // Fallback sphere animation
            if (!obj3D.isGLB) {
              const { sphere, ring1, ring2, particles, sphereMat, ring1Mat } = obj3D;
              if (sphere) sphere.rotation.y = t * 1.2;
              if (ring1) ring1.rotation.z = t * 0.5;
              if (ring2) ring2.rotation.z = -t * 0.3;
              if (particles) particles.rotation.y = t * 0.4;
              if (sphereMat) sphereMat.emissiveIntensity = 0.4 + Math.sin(t * 2) * 0.3;
              if (ring1Mat) ring1Mat.emissiveIntensity = 0.3 + Math.sin(t * 2 + 1) * 0.2;
            }

            // AnimationMixer — untuk animasi built-in di dalam file GLB (jika ada)
            if (obj3D.mixer) obj3D.mixer.update(delta);
          });

          // Particle burst animation
          burstRef.current = burstRef.current.filter((burst) => {
            burst.life -= 0.03;
            if (burst.life <= 0) {
              scene.remove(burst.particles);
              return false;
            }
            const pos = burst.particles.geometry.attributes.position.array;
            for (let i = 0; i < burst.vel.length; i++) {
              pos[i * 3] += burst.vel[i].x;
              pos[i * 3 + 1] += burst.vel[i].y;
              pos[i * 3 + 2] += burst.vel[i].z;
              burst.vel[i].y -= 0.001; // gravity
            }
            burst.particles.geometry.attributes.position.needsUpdate = true;
            burst.particles.material.opacity = burst.life;
            return true;
          });

          renderer.render(scene, camera);
        });
      } catch (err) {
        console.error("AR Error:", err);
        setArError(err?.message || "Gagal memuat AR");
        setLoading(false);
      }
    };

    initAR();

    return () => {
      if (rendererRef.current) rendererRef.current.setAnimationLoop(null);
      if (mindarRef.current) {
        try {
          mindarRef.current.stop();
        } catch (e) {}
        mindarRef.current = null;
      }
    };
  }, []);

  // ── Touch interactions (rotate + zoom + translate) ──
  // 1 finger → rotate
  // 2 finger pinch (mendekat/menjauh) → zoom
  // 2 finger pan (searah) → translate/geser
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getModel = () =>
      detectedId ? modelRefs.current[detectedId]?.group : null;

    // Ref untuk track gesture 2 jari
    const twoFingerMid = { x: 0, y: 0 };
    let prevMid = { x: 0, y: 0 };
    let isPanning = false;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        isPanning = false;
        lastTouch.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2) {
        isDragging.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist.current = Math.sqrt(dx * dx + dy * dy);
        // Track midpoint untuk pan detection
        prevMid.x = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        prevMid.y = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        isPanning = true;
      }
    };

    const onTouchMove = (e) => {
      const model = getModel();
      if (!model) return;

      if (e.touches.length === 1 && isDragging.current) {
        // ── 1 finger: rotate + translate bersamaan (Google AR style) ──
        const dx = e.touches[0].clientX - lastTouch.current.x;
        const dy = e.touches[0].clientY - lastTouch.current.y;

        // Rotate — sensitivity normal
        model.rotation.y += dx * 0.01;
        model.rotation.x += dy * 0.01;

        // Translate — sensitivity lebih rendah agar tidak terlalu sensitif
        // Ikut arah drag tapi lebih pelan, scale by zoom level
        const translateSpeed = 0.0015 * model.scale.x;
        model.position.x += dx * translateSpeed;
        model.position.y -= dy * translateSpeed;

        lastTouch.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2 && isPanning) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Midpoint 2 jari sekarang
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        const pinchDelta = dist - lastPinchDist.current;
        const midDeltaX = midX - prevMid.x;
        const midDeltaY = midY - prevMid.y;
        const midMovement = Math.sqrt(midDeltaX * midDeltaX + midDeltaY * midDeltaY);

        if (Math.abs(pinchDelta) > midMovement * 1.5) {
          // ── Pinch gesture dominan → zoom ──
          const newScale = Math.max(0.3, Math.min(2.5, model.scale.x + pinchDelta * 0.005));
          model.scale.setScalar(newScale);
        } else {
          // ── Pan gesture dominan → translate ──
          // Konversi pixel delta ke world unit (scale by current zoom)
          const panSpeed = 0.003 * model.scale.x;
          model.position.x += midDeltaX * panSpeed;
          model.position.y -= midDeltaY * panSpeed;
        }

        lastPinchDist.current = dist;
        prevMid.x = midX;
        prevMid.y = midY;
      }
    };

    // Double tap to reset posisi, rotasi, dan scale
    let lastTap = 0;
    const onTouchEndDbl = (e) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        const model = getModel();
        if (model) {
          model.rotation.set(0, 0, 0);
          model.scale.setScalar(1);
          model.position.set(0, 0, 0); // reset posisi juga
        }
      }
      lastTap = now;
      isDragging.current = false;
      isPanning = false;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEndDbl);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEndDbl);
    };
  }, [detectedId]);

  // ── Add points ──────────────────────────────────────
  useEffect(() => {
    // Hanya auto-show + beri points jika marker ini belum pernah di-scan
    if (detected && detectedId && !result && !pointsGivenRef.current.has(detectedId)) {
      const timer = setTimeout(() => {
        const objData = SCAN_OBJECTS[detectedId] || EXTRA_OBJECTS[detectedId];
        if (!objData) return;
        // Tandai sudah dapat points — tidak akan di-grant lagi
        pointsGivenRef.current.add(detectedId);
        // Simpan data result supaya bisa di-restore saat scan ulang
        savedResultRef.current[detectedId] = objData;
        setResult(objData);
        setResultExpanded(true);
        addPoints(objData.points, detectedId);
        showToast(`+${objData.points} EcoPoints diperoleh! 🌿`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [detected, result, detectedId, addPoints, showToast]);

  const resetResult = useCallback(() => {
    setResultExpanded(false);
    // Tampilkan trash challenge setelah info card di-close
    // hanya kalau belum pernah solve untuk marker ini di session ini
    if (detectedId && !trashSolvedRef.current.has(detectedId)) {
      trashTimeoutRef.current = setTimeout(() => setShowTrash(true), 400);
    }
  }, [detectedId]);

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-black"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        touchAction: "none",
      }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-[#050A07] flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-green-light/20 border-t-green-light animate-spin" />
          <p className="text-white/60 text-sm">Memuat AR Scanner...</p>
        </div>
      )}

      {/* Error */}
      {arError && (
        <div className="absolute inset-0 z-30 bg-[#050A07] flex flex-col items-center justify-center gap-4 px-6">
          <i className="fa-solid fa-triangle-exclamation text-red-400 text-4xl" />
          <p className="text-white font-semibold text-center">
            Gagal Memuat AR
          </p>
          <p className="text-white/50 text-xs text-center">{arError}</p>
          <button
            onClick={() => navigate("home")}
            className="px-6 py-2.5 rounded-xl bg-green-light/20 border border-green-light/30 text-green-light text-sm"
          >
            Kembali
          </button>
        </div>
      )}

      {/* Top Bar */}
      {!loading && !arError && (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("home")}
              className="w-9 h-9 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            >
              <i className="fa-solid fa-arrow-left text-sm" />
            </button>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <i className="fa-solid fa-leaf text-green-light" /> EcoLens AR
            </div>
          </div>
          <div
            className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border backdrop-blur-sm transition-all duration-500
            ${
              detected
                ? "bg-green-light/20 border-green-light/40 text-green-light"
                : "bg-white/10 border-white/10 text-white/60"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${detected ? "bg-green-light animate-pulse" : "bg-white/40"}`}
            />
            {detected
              ? `${activeMarker.label} Terdeteksi!`
              : "Mencari marker..."}
          </div>
        </div>
      )}

      {/* Scan Frame */}
      {!loading && !arError && !detected && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none gap-4">
          <div className="relative w-56 h-56 sm:w-64 sm:h-64">
            <div className="scan-corner tl" />
            <div className="scan-corner tr" />
            <div className="scan-corner bl" />
            <div className="scan-corner br" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <i className="fa-solid fa-camera text-white/20 text-3xl" />
              <p className="text-white/50 text-xs text-center px-4">
                Arahkan ke salah satu marker
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap justify-center px-6">
            {MARKERS.map((m) => (
              <div
                key={m.objectId}
                className="flex items-center gap-1.5 bg-black/40 border border-white/10 backdrop-blur-sm text-white/50 text-[10px] px-2.5 py-1.5 rounded-full"
              >
                <i className={`fa-solid ${m.icon} text-[10px]`} />
                {m.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gesture hints */}
      {showControls && !result && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex gap-3 pointer-events-none">
          {[
            { icon: "fa-hand", text: "Drag putar" },
            { icon: "fa-expand", text: "Pinch zoom" },
            { icon: "fa-hand-pointer", text: "Tap 2x reset" },
          ].map((hint) => (
            <div
              key={hint.text}
              className="flex flex-col items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-xl"
            >
              <i className={`fa-solid ${hint.icon} text-white/40 text-sm`} />
              <span className="text-white/30 text-[9px]">{hint.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Detected Indicator */}
      {detected && !result && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-green-light animate-ping opacity-40" />
            <p className="text-green-light text-xs animate-pulse">
              Menganalisis...
            </p>
          </div>
        </div>
      )}

      {/* Result Popup */}
      {result && (
        <>
          {/* Mini badge */}
          <div className="absolute bottom-28 left-4 z-35">
            <button
              onClick={() => setResultExpanded((e) => !e)}
              className="flex items-center gap-2 bg-[#111A14]/95 border border-[#1E2D22] backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-xl"
            >
              <div className="w-7 h-7 rounded-lg bg-green-light/15 flex items-center justify-center text-green-light text-sm">
                <i className={`fa-solid ${result.icon}`} />
              </div>
              <div className="text-left">
                <p className="text-white text-xs font-bold leading-none">
                  {result.name}
                </p>
                <p className="text-green-light text-[10px]">
                  +{result.points} EP
                </p>
              </div>
              <i
                className={`fa-solid ${resultExpanded ? "fa-chevron-down" : "fa-chevron-up"} text-white/40 text-xs ml-1`}
              />
            </button>
          </div>

          {/* Full card */}
          {resultExpanded && (
            <div className="absolute inset-x-4 bottom-44 z-35 bg-[#111A14]/95 border border-[#1E2D22] rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm animate-[fadeInUp_0.3s_ease_both]">
              <div className="flex items-start gap-3 p-4 border-b border-[#1E2D22]">
                <div className="w-11 h-11 rounded-xl bg-green-light/15 flex items-center justify-center text-green-light text-xl flex-shrink-0">
                  <i className={`fa-solid ${result.icon}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm">
                    {result.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/40 text-xs">Impact Score</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full ${i <= result.impactScore ? "bg-green-light" : "bg-white/15"}`}
                        />
                      ))}
                    </div>
                    <span className="text-green-light text-xs font-semibold">
                      {result.impactLabel}
                    </span>
                  </div>
                </div>
                <button
                  onClick={resetResult}
                  className="text-white/40 hover:text-white p-1"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: "fa-clock",
                      label: "Waktu Terurai",
                      value: result.decomposeTime,
                    },
                    {
                      icon: "fa-wind",
                      label: "Jejak Karbon",
                      value: result.carbon,
                    },
                  ].map((info) => (
                    <div
                      key={info.label}
                      className="bg-white/5 rounded-xl p-3 flex flex-col gap-1"
                    >
                      <i
                        className={`fa-solid ${info.icon} text-green-light text-sm`}
                      />
                      <span className="text-white/50 text-[10px]">
                        {info.label}
                      </span>
                      <span className="text-white font-semibold text-sm">
                        {info.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>Carbon Footprint</span>
                    <span className="text-white font-medium">
                      {result.carbonPct}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-light to-teal-light transition-all duration-700"
                      style={{ width: `${result.carbonPct}%` }}
                    />
                  </div>
                </div>

                <div className="bg-green-light/8 border border-green-light/15 rounded-xl p-3 flex gap-2">
                  <i className="fa-solid fa-circle-info text-green-light flex-shrink-0 mt-0.5 text-sm" />
                  <p className="text-white/70 text-xs leading-relaxed">
                    {result.fact}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 bg-green-light/10 border border-green-light/20 rounded-xl py-2">
                  <i className="fa-solid fa-leaf text-green-light text-sm" />
                  <span className="text-green-light font-bold text-sm">
                    +{result.points} EcoPoints diperoleh!
                  </span>
                </div>

                <button
                  className="btn-primary small full-w"
                  onClick={() => navigate("recycle")}
                >
                  <i className="fa-solid fa-recycle" /> Panduan Daur Ulang
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Trash Challenge ──────────────────────────── */}
      {showTrash && detected && detectedId && !trashSolved && (
        <div className="absolute inset-x-0 bottom-0 z-25 animate-[fadeInUp_0.4s_ease_both]">

          {/* Hint text */}
          <div className="text-center mb-3 px-4">
            <div className="inline-flex items-center gap-2 bg-[#111A14]/90 border border-[#1E2D22] backdrop-blur-sm px-4 py-2 rounded-full">
              <i className="fa-solid fa-hand-point-up text-green-light text-xs animate-bounce" />
              <span className="text-white/80 text-xs font-medium">
                Tap tempat sampah yang sesuai! 👇
              </span>
            </div>
          </div>

          {/* Trash bins */}
          <div className="flex items-end justify-between px-6 pb-44 gap-4">

            {/* Kiri — Organik */}
            <div
              ref={trashLeftRef}
              className="flex flex-col items-center gap-2 flex-1"
              onPointerUp={() => {
                const cat = TRASH_CATEGORY[detectedId];
                if (cat === "organik") {
                  setTrashFeedback("correct");
                  setTrashSolved(true);
                  trashSolvedRef.current.add(detectedId);
                  setShowTrash(false);
                  setTimeout(() => setTrashFeedback(null), 3000);
                } else {
                  setTrashFeedback("wrong");
                  setTimeout(() => setTrashFeedback(null), 2000);
                }
              }}
            >
              <div className="w-20 h-20 rounded-2xl bg-[#2d4a0e] border-2 border-[#84cc16] flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform cursor-pointer shadow-lg shadow-[#84cc16]/30">
                <i className="fa-solid fa-trash text-[#84cc16] text-3xl" />
              </div>
              <span className="text-[#84cc16] text-xs font-bold text-center leading-tight">
                🟢 Organik
              </span>
            </div>

            {/* Object indicator — ditengah */}
            <div className="flex flex-col items-center gap-1 opacity-60">
              <div className="w-10 h-10 rounded-xl bg-green-light/15 border border-green-light/30 flex items-center justify-center">
                <i className={`fa-solid ${(SCAN_OBJECTS[detectedId] || EXTRA_OBJECTS[detectedId])?.icon || 'fa-recycle'} text-green-light text-lg`} />
              </div>
              <i className="fa-solid fa-arrows-up-down text-white/30 text-xs" />
            </div>

            {/* Kanan — Anorganik */}
            <div
              ref={trashRightRef}
              className="flex flex-col items-center gap-2 flex-1"
              onPointerUp={() => {
                const cat = TRASH_CATEGORY[detectedId];
                if (cat === "anorganik") {
                  setTrashFeedback("correct");
                  setTrashSolved(true);
                  trashSolvedRef.current.add(detectedId);
                  setShowTrash(false);
                  setTimeout(() => setTrashFeedback(null), 3000);
                } else {
                  setTrashFeedback("wrong");
                  setTimeout(() => setTrashFeedback(null), 2000);
                }
              }}
            >
              <div className="w-20 h-20 rounded-2xl bg-[#0e2a4a] border-2 border-[#60a5fa] flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform cursor-pointer shadow-lg shadow-[#60a5fa]/30">
                <i className="fa-solid fa-trash text-[#60a5fa] text-3xl" />
              </div>
              <span className="text-[#60a5fa] text-xs font-bold text-center leading-tight">
                🔵 Anorganik
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Trash Feedback ───────────────────────────── */}
      {trashFeedback && (
        <div className={`absolute inset-x-6 top-1/2 -translate-y-1/2 z-40 flex items-center gap-4 px-5 py-5 rounded-2xl shadow-2xl animate-[fadeInUp_0.25s_ease_both]
          ${trashFeedback === 'correct'
            ? 'bg-[#0d2b1a] border-2 border-green-light'
            : 'bg-[#2b0d0d] border-2 border-red-500'}`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0
            ${trashFeedback === 'correct' ? 'bg-green-light/25 text-green-light' : 'bg-red-500/25 text-red-400'}`}
          >
            <i className={`fa-solid ${trashFeedback === 'correct' ? 'fa-circle-check' : 'fa-circle-xmark'} text-2xl`} />
          </div>
          <div className="flex-1">
            <p className={`font-black text-base ${trashFeedback === 'correct' ? 'text-green-light' : 'text-red-400'}`}>
              {trashFeedback === 'correct' ? 'Benar! 🎉 Pilihan tepat!' : 'Kurang tepat, coba lagi!'}
            </p>
            <p className="text-white/70 text-xs mt-1 leading-relaxed">
              {trashFeedback === 'correct'
                ? `${(SCAN_OBJECTS[detectedId] || EXTRA_OBJECTS[detectedId])?.name} termasuk sampah ${TRASH_CATEGORY[detectedId]}.`
                : 'Perhatikan kategori sampahnya ya 👆'}
            </p>
          </div>
        </div>
      )}

      {/* ── Solved indicator ─────────────────────────── */}
      {trashSolved && detected && (
        <div className="absolute bottom-44 left-4 z-30 flex items-center gap-2 bg-green-light/15 border border-green-light/30 px-3 py-2 rounded-xl animate-[fadeInUp_0.3s_ease_both]">
          <i className="fa-solid fa-circle-check text-green-light text-sm" />
          <span className="text-green-light text-xs font-semibold">Sorting selesai ✓</span>
        </div>
      )}

    </div>
  );
}