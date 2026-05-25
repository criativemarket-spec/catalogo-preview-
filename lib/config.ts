// lib/config.ts
import {
  collection, doc, getDocs, getDoc, addDoc,
  updateDoc, deleteDoc, setDoc, query, orderBy, where
} from 'firebase/firestore'
import { db } from './firebase'
import { Banner, SiteConfig } from '@/types'

// ─── BANNERS ────────────────────────────────────────────────
export async function getBanners(activeOnly = true): Promise<Banner[]> {
  const constraints: any[] = [orderBy('order', 'asc')]
  if (activeOnly) constraints.unshift(where('active', '==', true))
  const q = query(collection(db, 'banners'), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() })) as Banner[]
}

export async function createBanner(data: Omit<Banner, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'banners'), data)
  return ref.id
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<void> {
  await updateDoc(doc(db, 'banners', id), data)
}

export async function deleteBanner(id: string): Promise<void> {
  await deleteDoc(doc(db, 'banners', id))
}

// ─── SITE CONFIG ────────────────────────────────────────────
export async function getSiteConfig(): Promise<SiteConfig> {
  const snap = await getDoc(doc(db, 'config', 'site'))
  if (!snap.exists()) {
    return {
      whatsappNumber: '351900000000',
      storeName: 'Brasil Premium',
      welcomeMessage: 'Olá! Gostaria de solicitar um orçamento:',
    }
  }
  return snap.data() as SiteConfig
}

export async function updateSiteConfig(data: Partial<SiteConfig>): Promise<void> {
  await setDoc(doc(db, 'config', 'site'), data, { merge: true })
}
