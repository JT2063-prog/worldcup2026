import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, getDoc, setDoc, getDocs, collection,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBESm0jp2CUas7c2zPIWWWEQOgQLp_eBoY",
  authDomain: "wc2026-a6a50.firebaseapp.com",
  projectId: "wc2026-a6a50",
  storageBucket: "wc2026-a6a50.firebasestorage.app",
  messagingSenderId: "891500313264",
  appId: "1:891500313264:web:5d1cbe309b970650c75975"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const TIPPERS_COL = 'tippers';

// Slugify a name into a safe document ID
function slugify(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Save/update a tipper's full record (name, tips, golden boot pick)
export async function saveTipper(name, tips, goldenBootPick) {
  const id = slugify(name);
  if (!id) return null;
  const ref = doc(db, TIPPERS_COL, id);
  await setDoc(ref, {
    name: name.trim(),
    tips: tips || {},
    goldenBootPick: goldenBootPick || '',
    updatedAt: serverTimestamp(),
  }, { merge: true });
  return id;
}

// Load a single tipper by name
export async function loadTipper(name) {
  const id = slugify(name);
  if (!id) return null;
  const ref = doc(db, TIPPERS_COL, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Load all tippers (for the ladder)
export async function loadAllTippers() {
  const snap = await getDocs(collection(db, TIPPERS_COL));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Count "active" tippers - updated within last N hours
export function countActiveSince(tippers, hoursAgo = 24) {
  const cutoff = Date.now() - hoursAgo * 3600 * 1000;
  return tippers.filter(t => {
    const updated = t.updatedAt?.toMillis ? t.updatedAt.toMillis() : 0;
    return updated >= cutoff;
  }).length;
}
