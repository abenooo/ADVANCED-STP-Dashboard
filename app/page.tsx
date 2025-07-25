"use client"

import Link from "next/link"
import { ChevronRight, Settings, Users, Bell, RefreshCw, FileText, User, LogOut, LogIn, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import JobApplicationsPage from "./job-applications/page"
import BookingPage from "./booking/page"
import UserPage from "./user/page"
import CarrierPage from "./carrier/page"
import BlogPage from "./blog/page"
import ServicesPage from "./services/page"
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initialTheme = stored || "dark";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function TacticalDashboard() {
  const [activeSection, setActiveSection] = useState("services")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="flex flex-col h-full justify-between p-4">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
                <h1 className="text-orange-500 font-bold text-lg tracking-wider">ADVANCED STP</h1>
                <p className="text-neutral-500 text-xs">v1.0.0</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-neutral-400 hover:text-orange-500"
              >
                <ChevronRight
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
                />
              </Button>
            </div>

            <nav className="space-y-2">
              {[
                { id: "job-applications", icon: Users, label: "JOB APPLICATIONS" },
                { id: "booking", icon: Bell, label: "BOOKING" },
                { id: "user", icon: Users, label: "USER" },
                { id: "carrier", icon: Users, label: "CARRIER" },
                { id: "blog", icon: FileText, label: "BLOG" },
                { id: "services", icon: Settings, label: "SERVICES" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                    activeSection === item.id
                      ? "bg-orange-500 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>
          {/* User Settings at the bottom */}
          {!sidebarCollapsed && (
            <div className="p-4 bg-neutral-800 border border-neutral-700 rounded mb-2">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-white" />
                <span className="text-xs text-white">USER SETTINGS</span>
              </div>
              <div className="space-y-2 mt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-neutral-400 hover:text-white hover:bg-neutral-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">Profile</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    localStorage.removeItem("token")
                    router.push("/login")
                  }}
                  className="w-full justify-start text-neutral-400 hover:text-white hover:bg-neutral-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="text-sm">Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-neutral-800 border-b border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">SERVICE PROVIDER / DASHBOARD</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-neutral-500">LAST UPDATE: 05/06/2025 20:00 UTC</div>
       
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Link href="/login" passHref>
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
                <LogIn className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-orange-500"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          {activeSection === "job-applications" && <JobApplicationsPage />}
          {activeSection === "booking" && <BookingPage />}
          {activeSection === "user" && <UserPage />}
          {activeSection === "carrier" && <CarrierPage />}
          {activeSection === "blog" && <BlogPage />}
          {activeSection === "services" && <ServicesPage />}
        </div>
      </div>
    </div>
  )
}
