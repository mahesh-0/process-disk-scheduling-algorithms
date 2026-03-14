/**
 * Signup Page
 *
 * Registration form with:
 * - Full Name (min 3 chars), Email, Password (min 6 chars), Confirm Password
 * - Inline validation errors below each input
 * - Submit button disabled when form is invalid
 * - Show/hide password toggles for both password fields
 * - Loading spinner during signup
 * - Success toast and redirect to /Dashboard on success
 * - Link to Login page
 *
 * Uses the app's existing design system (CSS variables for dark/light mode).
 */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, UserPlus, Zap } from "lucide-react";
import { getAuthErrorMessage } from "@/firebase/authErrors";

export default function Signup() {
    const navigate = useNavigate();
    const { signup, googleLogin } = useAuth();

    const [googleLoading, setGoogleLoading] = useState(false);

    // Form state
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Validation state
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    /**
     * Validate individual field and return error message or empty string.
     */
    const validateField = (name, value) => {
        switch (name) {
            case "fullName":
                if (!value.trim()) return "Full name is required";
                if (value.trim().length < 3)
                    return "Full name must be at least 3 characters";
                return "";
            case "email":
                if (!value.trim()) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return "Please enter a valid email";
                return "";
            case "password":
                if (!value) return "Password is required";
                if (value.length < 6) return "Password must be at least 6 characters";
                return "";
            case "confirmPassword":
                if (!value) return "Please confirm your password";
                if (value !== password) return "Passwords do not match";
                return "";
            default:
                return "";
        }
    };

    /**
     * Handle input change — update value and validate if field was touched.
     */
    const handleChange = (name, value) => {
        const setters = {
            fullName: setFullName,
            email: setEmail,
            password: setPassword,
            confirmPassword: setConfirmPassword,
        };
        setters[name]?.(value);

        if (touched[name]) {
            setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
        }

        // Re-validate confirmPassword when password changes
        if (name === "password" && touched.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword:
                    confirmPassword && value !== confirmPassword
                        ? "Passwords do not match"
                        : confirmPassword
                            ? ""
                            : "Please confirm your password",
            }));
        }
    };

    /**
     * Mark field as touched and trigger validation.
     */
    const handleBlur = (name, value) => {
        setTouched((prev) => ({ ...prev, [name]: true }));
        setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    };

    /**
     * Check if the form is valid for submission.
     */
    const isFormValid =
        fullName.trim().length >= 3 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        password.length >= 6 &&
        confirmPassword === password;

    /**
     * Handle form submission.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const allErrors = {
            fullName: validateField("fullName", fullName),
            email: validateField("email", email),
            password: validateField("password", password),
            confirmPassword: validateField("confirmPassword", confirmPassword),
        };

        setTouched({
            fullName: true,
            email: true,
            password: true,
            confirmPassword: true,
        });
        setErrors(allErrors);

        // Stop if any errors
        if (Object.values(allErrors).some((err) => err)) return;

        setIsLoading(true);
        try {
            await signup(email, password, fullName);
            toast.success("Account created successfully!");
            navigate("/Dashboard");
        } catch (error) {
            console.error("Signup failed:", error);
            const message = getAuthErrorMessage(
                error,
                "Signup failed. Please try again.",
            );
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Render a form input field with label, error state, and optional password toggle.
     */
    const renderInput = ({
        id,
        label,
        name,
        type = "text",
        value,
        placeholder,
        showToggle = false,
        isPasswordVisible = false,
        onToggle,
    }) => (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-foreground mb-1.5"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={showToggle ? (isPasswordVisible ? "text" : "password") : type}
                    value={value}
                    onChange={(e) => handleChange(name, e.target.value)}
                    onBlur={(e) => handleBlur(name, e.target.value)}
                    placeholder={placeholder}
                    disabled={isLoading}
                    className={`w-full h-10 px-3 ${showToggle ? "pr-10" : ""} rounded-lg bg-secondary text-foreground text-sm
            placeholder:text-muted-foreground outline-none transition-all
            focus:ring-2 focus:ring-primary/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${errors[name] && touched[name] ? "ring-2 ring-destructive/50" : ""}`}
                />
                {showToggle && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                    >
                        {isPasswordVisible ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                )}
            </div>
            {errors[name] && touched[name] && (
                <p className="text-destructive text-xs mt-1">{errors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-background px-4 py-8 overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2.5 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">AlgoSIM</span>
                </div>

                {/* Card */}
                <div className="glass rounded-xl shadow-lg border border-border p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-foreground">
                            Create Account
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Sign up to start using AlgoSIM
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {renderInput({
                            id: "signup-fullname",
                            label: "Full Name",
                            name: "fullName",
                            value: fullName,
                            placeholder: "John Doe",
                        })}

                        {renderInput({
                            id: "signup-email",
                            label: "Email",
                            name: "email",
                            type: "email",
                            value: email,
                            placeholder: "you@example.com",
                        })}

                        {renderInput({
                            id: "signup-password",
                            label: "Password",
                            name: "password",
                            value: password,
                            placeholder: "At least 6 characters",
                            showToggle: true,
                            isPasswordVisible: showPassword,
                            onToggle: () => setShowPassword(!showPassword),
                        })}

                        {renderInput({
                            id: "signup-confirm-password",
                            label: "Confirm Password",
                            name: "confirmPassword",
                            value: confirmPassword,
                            placeholder: "Re-enter your password",
                            showToggle: true,
                            isPasswordVisible: showConfirmPassword,
                            onToggle: () => setShowConfirmPassword(!showConfirmPassword),
                        })}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm
                hover:opacity-90 transition-all flex items-center justify-center gap-2
                disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">OR</span>
                        <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Google Sign-Up Button */}
                    <button
                        type="button"
                        disabled={isLoading || googleLoading}
                        onClick={async () => {
                            setGoogleLoading(true);
                            try {
                                await googleLogin();
                                toast.success("Account created successfully!");
                                navigate("/Dashboard");
                            } catch (error) {
                                console.error("Google signup failed:", error);
                                if (error.code !== "auth/popup-closed-by-user") {
                                    const message = getAuthErrorMessage(error, "Google sign-up failed.");
                                    toast.error(message);
                                }
                            } finally {
                                setGoogleLoading(false);
                            }
                        }}
                        className="w-full h-10 rounded-lg bg-secondary text-foreground font-medium text-sm
                            hover:bg-secondary/80 transition-all flex items-center justify-center gap-2
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {googleLoading ? (
                            <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/Login"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
