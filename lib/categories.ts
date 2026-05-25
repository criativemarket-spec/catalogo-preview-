// lib/categories.ts
import {
  collection, doc, getDocs, addDoc, updateDoc,
  deleteDoc, query, where, orderBy
} from 'firebase/firestore'
import { db } from './firebase'
import { Category } from '@/types'

const COLLECTION = 'categories'

export async function getCategories(visibleOnly = true): Promise<Category[]> {
  const constraints: any[] = [orderBy('order', 'asc')]
  if (visibleOnly) constraints.unshift(where('visible', '==', true))
  const q = query(collection(db, COLLECTION), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[]
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), data)
  return docRef.id
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data)
}

export async function deleteCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id))
}
