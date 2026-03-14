/**
 * Auth Context Provider
 *
 * Manages global authentication state using Firebase's onAuthStateChanged.
 * Provides currentUser, loading state, and auth functions (signup, login, logout)
 * to all child components via React Context.
 *
 * Firebase handles authentication persistence automatically —
 * users remain logged in across browser refreshes.
 */
import React, { createContext, useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { signupUser, loginUser, logoutUser, loginWithGoogle } from "@/firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    /**
     * Signup a new user with email, password, and full name.
     * @param {string} email
     * @param {string} password
     * @param {string} fullName
     */
    const signup = async (email, password, fullName) => {
        return await signupUser(email, password, fullName);
    };

    /**
     * Login an existing user with email and password.
     * @param {string} email
     * @param {string} password
     */
    const login = async (email, password) => {
        return await loginUser(email, password);
    };

    /**
     * Login with Google OAuth popup.
     */
    const googleLogin = async () => {
        return await loginWithGoogle();
    };

    /**
     * Logout the currently authenticated user.
     */
    const logout = async () => {
        return await logoutUser();
    };

    const value = {
        currentUser,
        loading,
        signup,
        login,
        googleLogin,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to access the auth context.
 * Must be used within an AuthProvider.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
