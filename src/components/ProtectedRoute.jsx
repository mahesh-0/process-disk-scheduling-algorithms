/**
 * ProtectedRoute Component
 *
 * Guards routes that require authentication.
 * - Shows a loading spinner while Firebase is determining auth state.
 * - Redirects unauthenticated users to the Login page.
 * - Renders children if the user is authenticated.
 */
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    // Show loading spinner while checking auth state
    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!currentUser) {
        return <Navigate to="/Login" replace />;
    }

    return children;
};

export default ProtectedRoute;
