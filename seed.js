import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxEJUkRDd9yrHsJrl3e-q7DtfHlLQs_As",
  authDomain: "ecolens-8723f.firebaseapp.com",
  projectId: "ecolens-8723f",
  storageBucket: "ecolens-8723f.firebasestorage.app",
  messagingSenderId: "550679202334",
  appId: "1:550679202334:web:b32ab124fbac69ad4d3c0f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const objectsData = {
  plastic: {
    name: "Plastic Bottle",
    icon: "🧴",
    points: 15,
    category: "recyclable",
    disposalTips: "Cuci bersih, lepas tutup, masukkan ke tempat sampah daur ulang",
    color: "#3B82F6"
  },
  can: {
    name: "Aluminum Can",
    icon: "🥤",
    points: 20,
    category: "recyclable",
    disposalTips: "Gepengkan kaleng, masukkan ke tempat sampah logam",
    color: "#F59E0B"
  },
  paper: {
    name: "Paper",
    icon: "📄",
    points: 10,
    category: "recyclable",
    disposalTips: "Pastikan kering, tidak berminyak, ikat dan kumpulkan",
    color: "#10B981"
  },
  battery: {
    name: "Battery",
    icon: "🔋",
    points: 30,
    category: "hazardous",
    disposalTips: "JANGAN buang ke tempat sampah biasa! Bawa ke drop point baterai bekas",
    color: "#EF4444"
  },
  cardboard: {
    name: "Cardboard",
    icon: "📦",
    points: 10,
    category: "recyclable",
    disposalTips: "Lipat rata, jaga tetap kering, kumpulkan ke pengepul",
    color: "#8B5CF6"
  },
  glass: {
    name: "Glass Bottle",
    icon: "🍶",
    points: 25,
    category: "recyclable",
    disposalTips: "Bersihkan sisa isi, bungkus jika pecah, pisahkan dari sampah lain",
    color: "#06B6D4"
  },
  plastic_bag: {
    name: "Plastic Bag",
    icon: "🛍️",
    points: 10,
    category: "recyclable",
    disposalTips: "Kumpulkan beberapa kantong, bawa ke drop point plastik di supermarket",
    color: "#F97316"
  },
  tisu: {
    name: "Tisu Bekas",
    icon: "🧻",
    points: 10,
    category: "non-recyclable",
    disposalTips: "Tisu bekas TIDAK bisa didaur ulang. Buang ke tempat sampah organik atau sampah residu.",
    color: "#A78BFA"
  },
  styrofoam: {
    name: "Styrofoam",
    icon: "🍱",
    points: 35,
    category: "hazardous",
    disposalTips: "JANGAN bakar styrofoam! Kumpulkan dan bawa ke pusat daur ulang khusus styrofoam.",
    color: "#64748B"
  },
  sisa_makanan: {
    name: "Sisa Makanan",
    icon: "🍚",
    points: 15,
    category: "organic",
    disposalTips: "Jadikan kompos rumahan. Pisahkan dari sampah anorganik. Bisa diolah jadi pupuk dalam 4-6 minggu.",
    color: "#84CC16"
  }
};

async function seedDatabase() {
  console.log("🌱 Mulai seed database...");
  
  for (const [id, data] of Object.entries(objectsData)) {
    await setDoc(doc(db, "objects", id), data);
    console.log(`✅ Berhasil: objects/${id}`);
  }
  
  console.log("🎉 Seed selesai! Semua data sudah masuk ke Firestore.");
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});