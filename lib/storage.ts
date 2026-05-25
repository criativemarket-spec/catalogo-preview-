// lib/storage.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './firebase'

export async function uploadImage(
  file: File,
  folder: 'products' | 'banners' | 'categories'
): Promise<string> {
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const storageRef = ref(storage, filename)

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  })
  return getDownloadURL(snapshot.ref)
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
  } catch (e) {
    // ignora se arquivo não existe
  }
}

export async function uploadMultipleImages(
  files: File[],
  folder: 'products' | 'banners' | 'categories'
): Promise<string[]> {
  return Promise.all(files.map(f => uploadImage(f, folder)))
}
