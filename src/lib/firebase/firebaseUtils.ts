import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// Delete user account and all associated data
export const deleteUserAccount = async (userId: string) => {
  try {
    // Delete user profile from Firestore
    await deleteDocument('userProfiles', userId);
    
    // Try to delete storage files if they exist
    try {
      const storageRef = ref(storage, `users/${userId}`);
      const filesList = await listAll(storageRef);
      if (filesList.items.length > 0) {
        const deletionPromises = filesList.items.map(item => deleteObject(item));
        await Promise.all(deletionPromises);
      }
    } catch (storageError) {
      // Ignore storage errors - the folder might not exist if user never uploaded files
      console.log('No storage files found or error accessing storage:', storageError);
    }
    
    // Delete the user's authentication account
    const currentUser = auth.currentUser;
    if (currentUser) {
      await deleteUser(currentUser);
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting user account", error);
    throw error;
  }
};
