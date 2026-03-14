/**
 * App.jsx — Root Application Component
 *
 * Sets up routing with React Router:
 * - /Login and /Signup are public routes
 * - All other pages are wrapped in ProtectedRoute
 * - AuthProvider wraps the entire app for global auth state
 * - react-hot-toast Toaster provides notifications
 */
import { Toaster } from "react-hot-toast";
import { pagesConfig } from "./pages.config";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : () => <></>;

const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ? (
    <Layout currentPageName={currentPageName}>{children}</Layout>
  ) : (
    <>{children}</>
  );

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes — accessible without authentication */}
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />

          {/* Protected Routes — require authentication */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LayoutWrapper currentPageName={mainPageKey}>
                  <MainPage />
                </LayoutWrapper>
              </ProtectedRoute>
            }
          />
          {Object.entries(Pages).map(([path, Page]) => (
            <Route
              key={path}
              path={`/${path}`}
              element={
                <ProtectedRoute>
                  <LayoutWrapper currentPageName={path}>
                    <Page />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
          ))}

          {/* 404 — Not Found */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(222 47% 9%)",
            color: "hsl(210 40% 96%)",
            border: "1px solid hsl(222 47% 16%)",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
          },
          success: {
            iconTheme: {
              primary: "hsl(172 66% 50%)",
              secondary: "hsl(222 47% 9%)",
            },
          },
          error: {
            iconTheme: {
              primary: "hsl(0 84% 60%)",
              secondary: "hsl(222 47% 9%)",
            },
          },
        }}
      />
    </AuthProvider>
  );
}

export default App;
