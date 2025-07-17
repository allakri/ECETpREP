
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { AppUser, RegisterFormValues } from './types';

export const createUserProfile = async (uid: string, data: RegisterFormValues): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
        uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        college: data.college,
        branch: data.branch,
        year: data.year,
        createdAt: new Date(),
    });
};

export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
        return docSnap.data() as AppUser;
    } else {
        return null;
    }
};

export const updateUserProfile = async (uid: string, data: Partial<AppUser>): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
};
