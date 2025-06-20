"use client"

import { db } from "@/components/FirebaseConfig"
import type { FormData } from "@/types/form"
import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore"

export const saveForm = async (formData: FormData): Promise<string> => {
  try {
    const formRef = await addDoc(collection(db, "forms"), formData)
    return formRef.id
  } catch (error) {
    console.error("Error saving form:", error)
    throw error
  }
}

export const updateForm = async (formId: string, formData: FormData): Promise<void> => {
  try {
    const formRef = doc(db, "forms", formId)
    await updateDoc(formRef, { ...formData })
  } catch (error) {
    console.error("Error updating form:", error)
    throw error
  }
}

export const getForm = async (formId: string): Promise<FormData | null> => {
  try {
    const formRef = doc(db, "forms", formId)
    const formSnap = await getDoc(formRef)

    if (formSnap.exists()) {
      return formSnap.data() as FormData
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting form:", error)
    throw error
  }
}

export const getUserForms = async (userId: string): Promise<FormData[]> => {
  try {
    const formsQuery = query(collection(db, "forms"), where("ownerUid", "==", userId))
    const querySnapshot = await getDocs(formsQuery)

    const forms: FormData[] = []
    querySnapshot.forEach((doc) => {
      forms.push(doc.data() as FormData)
    })

    return forms
  } catch (error) {
    console.error("Error getting user forms:", error)
    throw error
  }
}

export const deleteForm = async (formId: string): Promise<void> => {
  try {
    const formRef = doc(db, "forms", formId)
    await deleteDoc(formRef)
  } catch (error) {
    console.error("Error deleting form:", error)
    throw error
  }
}
