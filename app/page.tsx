"use client"

import Link from "next/link"
import { ChevronRight, Settings, Users, Bell, RefreshCw, FileText, User, LogOut, LogIn, Sun, Moon, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import JobApplicationsPage from "./job-applications/page"
import BookingPage from "./booking/page"  
import CarrierPage from "./carrier/page"
import BlogPage from "./blog/page"
import ServicesPage from "./services/page"
import AdminUsersPage from "./admin/users/page"
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import Dashboard from "./api/dashboard/page"

export default function TacticalDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const searchParams = useSearchParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Format section name for display
  const formatSectionName = (section: string) => {
    if (section === 'admin-users') return 'Admin Users';
    return section
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get current date and time for the last update
  const [currentDateTime, setCurrentDateTime] = useState('');
  
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '') + ' UTC');
    };
    
    // Update immediately and then every minute
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Get section from URL query params if it exists
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-70"} bg-sidebar border-r border-sidebar-border transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
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
                className="text-sidebar-foreground/70 hover:text-orange-500"
              >
                <ChevronRight
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
                />
              </Button>
            </div>

            <nav className="space-y-2">
              {[
                { id: "dashboard", icon: LayoutDashboard, label: "DASHBOARD" },
                { id: "job-applications", icon: Users, label: "JOB APPLICATIONS" },
                { id: "booking", icon: Bell, label: "BOOKING" },
                { id: "carrier", icon: Users, label: "CARRIER" },
                { id: "blog", icon: FileText, label: "BLOG" },
                { id: "services", icon: Settings, label: "SERVICES" },
                { id: "admin-users", icon: User, label: "ADMIN USERS" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                    activeSection === item.id
                      ? "bg-orange-500 text-white"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
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
            <div className="p-4 bg-sidebar-accent border border-sidebar-border rounded mb-2">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-sidebar-foreground" />
                <span className="text-xs text-sidebar-foreground">USER SETTINGS</span>
              </div>
              <div className="space-y-2 mt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">Profile</span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    localStorage.removeItem("token")
                   window.location.href = "/login"
                  }}
                  className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}>
        {/* Top Toolbar */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              ADMIN USERS
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground">LAST UPDATE: {currentDateTime}</div>
       
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-orange-500">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-orange-500">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Link href="/login" passHref>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-orange-500">
                <LogIn className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-orange-500"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto bg-background">
          {activeSection === "dashboard" && <Dashboard />}
          {activeSection === "job-applications" && <JobApplicationsPage />}
          {activeSection === "booking" && <BookingPage />}
          {activeSection === "carrier" && <CarrierPage />}
          {activeSection === "blog" && <BlogPage />}
          {activeSection === "services" && <ServicesPage />}
          {activeSection === "admin-users" && <AdminUsersPage />}
          
        </div>
      </div>
    </div>
  )
}