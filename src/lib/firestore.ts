
import { db } from './firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

interface UserProfileData {
  name: string;
  email: string;
  phoneNumber: string;
  branch: string;
  college: string;
  yearOfStudy: string;
}

// Create a new user profile document in Firestore
export const createUserProfile = async (userId: string, data: UserProfileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      uid: userId,
      ...data,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Error creating user profile: ", error);
    throw error;
  }
};

// Update an existing user profile document
export const updateUserProfile = async (userId: string, data: Partial<UserProfileData>) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};
