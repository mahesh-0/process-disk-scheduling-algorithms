/**
 * Firebase Auth Utilities
 *
 * Provides modular functions for signup, login, and logout
 * using Firebase Authentication with email and password.
 */
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

const googleProvider = new GoogleAuthProvider();

/**
 * Creates a new user account with email and password,
 * then sets the displayName on the user profile.
 *
 * @param {string} email - User's email address
 * @param {string} password - User's chosen password
 * @param {string} fullName - User's full name (set as displayName)
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export const signupUser = async (email, password, fullName) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
    );

    // Do not fail signup if profile update fails after account creation.
    try {
        if (fullName?.trim()) {
            await updateProfile(userCredential.user, { displayName: fullName.trim() });
        }
    } catch (profileError) {
        console.warn("Account created, but profile update failed:", profileError);
    }

    return userCredential;
};

/**
 * Signs in an existing user with email and password.
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Signs in a user using Google OAuth popup.
 *
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export const loginWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
};

/**
 * Signs out the currently authenticated user.
 *
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
    return await signOut(auth);
};
