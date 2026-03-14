import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Cpu,
  HardDrive,
  BookOpen,
  GitCompare,
  History,
  Menu,
  Sun,
  Moon,
  Zap,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((p) => !p) };
}

const NAV_ITEMS = [
  { name: "Dashboard", page: "Dashboard", icon: LayoutDashboard },
  {
    name: "CPU Scheduling",
    page: "CpuScheduling",
    icon: Cpu,
    children: [
      { name: "FCFS", page: "CpuScheduling", params: "?algo=fcfs" },
      { name: "Round Robin", page: "CpuScheduling", params: "?algo=rr" },
      { name: "SJN", page: "CpuScheduling", params: "?algo=sjn" },
      { name: "SRTN", page: "CpuScheduling", params: "?algo=srtn" },
      { name: "Priority", page: "CpuScheduling", params: "?algo=priority" },
    ],
  },
  {
    name: "Disk Scheduling",
    page: "DiskScheduling",
    icon: HardDrive,
    children: [
      { name: "FCFS", page: "DiskScheduling", params: "?algo=fcfs" },
      { name: "SCAN", page: "DiskScheduling", params: "?algo=scan" },
      { name: "C-SCAN", page: "DiskScheduling", params: "?algo=cscan" },
      { name: "LOOK", page: "DiskScheduling", params: "?algo=look" },
      { name: "C-LOOK", page: "DiskScheduling", params: "?algo=clook" },
    ],
  },
  { name: "Algorithm Guide", page: "AlgorithmGuide", icon: BookOpen },
  { name: "Compare", page: "CompareAlgorithms", icon: GitCompare },
  { name: "History", page: "SimHistory", icon: History },
];

function SidebarContent({ currentPageName, closeMobile }) {
  const [expandedSections, setExpandedSections] = useState({
    "CPU Scheduling": true,
    "Disk Scheduling": true,
  });

  const toggleSection = (name) => {
    setExpandedSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <Link
          to={createPageUrl("Dashboard")}
          onClick={closeMobile}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">AlgoSIM</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV_ITEMS.map((item) => {
          const isActive = currentPageName === item.page;
          const Icon = item.icon;

          return (
            <div key={item.name} className="mb-1">
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleSection(item.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                      ${currentPageName === item.page ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{item.name}</span>
                    <motion.span
                      animate={{
                        rotate: expandedSections[item.name] ? 180 : 0,
                      }}
                      className="text-xs"
                    >
                      ▾
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {expandedSections[item.name] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden ml-7 border-l border-border"
                      >
                        {item.children.map((child) => {
                          const urlParams = new URLSearchParams(
                            window.location.search,
                          );
                          const currentAlgo = urlParams.get("algo");
                          const childAlgo = new URLSearchParams(
                            child.params,
                          ).get("algo");
                          const isChildActive =
                            currentPageName === child.page &&
                            currentAlgo === childAlgo;

                          return (
                            <Link
                              key={child.name}
                              to={createPageUrl(child.page + child.params)}
                              onClick={closeMobile}
                              className={`block px-3 py-1.5 text-xs rounded-r-md transition-all
                                ${isChildActive
                                  ? "text-primary bg-primary/10 border-l-2 border-primary -ml-px"
                                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                                }`}
                            >
                              {child.name}
                              {isChildActive && (
                                <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                                  Active
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to={createPageUrl(item.page)}
                  onClick={closeMobile}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                    ${isActive
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-[10px] text-muted-foreground text-center">
          AlgoSIM v1.0 · OS Scheduling Visualizer
        </p>
      </div>
    </div>
  );
}

/**
 * Logout button shown in the top bar.
 * Signs out the user and redirects to Login page.
 */
function LogoutButton() {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/Login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {currentUser && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="hidden sm:inline text-xs truncate max-w-[140px]">
            {currentUser.displayName || currentUser.email}
          </span>
        </div>
      )}
      <Button
        size="sm"
        variant="ghost"
        className="ml-auto text-muted-foreground hover:text-destructive gap-2"
        onClick={handleLogout}
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </Button>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle } = useTheme();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-border bg-card flex-col">
        <SidebarContent
          currentPageName={currentPageName}
          closeMobile={() => { }}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-card z-50 lg:hidden"
            >
              <SidebarContent
                currentPageName={currentPageName}
                closeMobile={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden h-8 w-8"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={toggle}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div
                key={isDark ? "moon" : "sun"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </motion.div>
            </Button>
            <LogoutButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={currentPageName}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
