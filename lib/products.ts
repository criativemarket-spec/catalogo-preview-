// lib/products.ts
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, query, where, orderBy, limit, Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Product } from '@/types'

const COL = 'products'

function toDate(val: any): Date {
  if (!val) return new Date()
  if (val?.toDate) return val.toDate()
  return new Date(val)
}

function mapDoc(d: any): Product {
  const data = d.data()
  return { id: d.id, ...data, createdAt: toDate(data.createdAt), updatedAt: toDate(data.updatedAt) } as Product
}

export async function getProducts(opts?: {
  categoryId?: string
  featured?: boolean
  limitCount?: number
}): Promise<Product[]> {
  // Query simples sem índice composto
  const snap = await getDocs(collection(db, COL))
  let results = snap.docs.map(mapDoc).filter(p => p.visible)
  
  if (opts?.categoryId) {
    results = results.filter(p => p.categoryId === opts.categoryId)
  }
  if (opts?.featured !== undefined) {
    results = results.filter(p => p.featured === opts.featured)
  }
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  if (opts?.limitCount) {
    results = results.slice(0, opts.limitCount)
  }
  return results
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return mapDoc(snap)
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const snap = await getDocs(collection(db, COL))
  return snap.docs.map(mapDoc).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function createProduct(data: Omit<Product, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })
  return ref.id
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: Timestamp.now() })
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id))
}

export async function searchProducts(term: string): Promise<Product[]> {
  const snap = await getDocs(collection(db, COL))
  const lower = term.toLowerCase()
  return snap.docs.map(mapDoc).filter(p =>
    p.visible && (
      p.name.toLowerCase().includes(lower) ||
      p.description?.toLowerCase().includes(lower)
    )
  )
}
