import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "./firebase"

export interface FirebaseNote {
  id?: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  isPinned: boolean
  isArchived: boolean
  isTrashed: boolean
  images: string[]
  password?: string
  isPasswordProtected: boolean
}

const NOTES_COLLECTION = "notes"

export const subscribeToNotes = (callback: (notes: FirebaseNote[]) => void) => {
  const q = query(collection(db, NOTES_COLLECTION), orderBy("updatedAt", "desc"))

  return onSnapshot(q, (snapshot) => {
    const notes: FirebaseNote[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      // Don't load content for password-protected notes
      notes.push({
        id: doc.id,
        ...data,
        content: data.isPasswordProtected ? "" : data.content, // Empty content for locked notes
      } as FirebaseNote)
    })
    callback(notes)
  })
}

export const getLockedNoteContent = async (id: string): Promise<string> => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, id)
    const { getDoc } = await import("firebase/firestore")
    const docSnap = await getDoc(noteRef)

    if (docSnap.exists()) {
      return docSnap.data().content || ""
    }
    return ""
  } catch (error) {
    console.error("Error getting locked note content:", error)
    throw error
  }
}

// Add new note
export const addNote = async (note: Omit<FirebaseNote, "id" | "createdAt" | "updatedAt">) => {
  try {
    const docRef = await addDoc(collection(db, NOTES_COLLECTION), {
      ...note,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding note:", error)
    throw error
  }
}

// Update note
export const updateNote = async (id: string, updates: Partial<FirebaseNote>) => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, id)
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating note:", error)
    throw error
  }
}

// Delete note
export const deleteNote = async (id: string) => {
  try {
    await deleteDoc(doc(db, NOTES_COLLECTION, id))
  } catch (error) {
    console.error("Error deleting note:", error)
    throw error
  }
}

// Upload image to Firebase Storage
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const timestamp = Date.now()
    const fileName = `images/${timestamp}_${file.name}`
    const storageRef = ref(storage, fileName)

    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    console.error("Error uploading image:", error)
    throw error
  }
}

// Verify note password
export const verifyNotePassword = (note: FirebaseNote, inputPassword: string): boolean => {
  if (!note.isPasswordProtected || !note.password) {
    return true
  }
  return note.password === inputPassword
}

// Set note password
export const setNotePassword = async (id: string, password: string) => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, id)
    await updateDoc(noteRef, {
      password: password,
      isPasswordProtected: true,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error setting password:", error)
    throw error
  }
}

// Remove note password
export const removeNotePassword = async (id: string) => {
  try {
    const noteRef = doc(db, NOTES_COLLECTION, id)
    await updateDoc(noteRef, {
      password: "",
      isPasswordProtected: false,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error removing password:", error)
    throw error
  }
}
