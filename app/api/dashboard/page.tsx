"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | string;
  loading?: boolean;
  className?: string;
  onViewAll?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, loading, className, onViewAll }) => {
  // Map card titles to their corresponding section names
  const sectionMap: Record<string, string> = {
    'Applications': 'job-applications',
    'Bookings': 'booking',
    'Career Jobs': 'carrier',
    'Blog Posts': 'blog',
    'Services': 'services',
    'Users': 'admin-users',
  };

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onViewAll) {
      onViewAll();
    } else {
      const section = sectionMap[title];
      if (section) {
        window.location.href = `/?section=${section}`;
      }
    }
  };

  return (
    <Card className={cn(
      "p-6 bg-card border border-border hover:border-orange-500 transition-colors relative group",
      className
    )}>
      <CardHeader className="flex flex-col gap-2 p-0">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">
            {title}
          </span>
          {!loading && (
            <a 
              href={`/?section=${sectionMap[title] || ''}`}
              onClick={handleViewAll}
              className="text-xs text-orange-500 hover:underline hover:text-orange-600 transition-colors"
            >
              View All
            </a>
          )}
        </div>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <span className="text-2xl font-bold text-foreground">{value}</span>
        )}
      </CardHeader>
    </Card>
  );
};

interface UserMetrics {
  total: number;
  admin: number;
  staff: number;
  user: number;
  [key: string]: number; // For dynamic role counts
}

interface DashboardMetrics {
  bookings: number;
  applications: number;
  blogs: number;
  users: UserMetrics;
  services: number;
  careerJobs: number;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    bookings: 0,
    applications: 0,
    blogs: 0,
    users: {
      total: 0,
      admin: 0,
      staff: 0,
      user: 0
    },
    services: 0,
    careerJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts();
  }, []); // Empty dependency array means this runs once on mount

  // Helper to get token from localStorage (set during login)
  const getToken = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);

  // For internal API routes cookies are sent automatically, so we don't attach headers here.
  const fetchInternal = (url: string) => fetch(url, { cache: "no-store" });

  // Update the fetchCounts function to properly handle API responses
  async function fetchCounts() {
    setLoading(true);
    try {
      // Make parallel API calls
      const [
        bookingsRes, 
        appsRes, 
        blogsRes, 
        usersRes, 
        servicesRes,
        careerJobsRes
      ] = await Promise.all([
        fetchInternal("/api/booking"),
        fetchInternal("/api/applications"),
        fetch("/api/blog-posts"),
        fetchInternal("/api/user"),
        fetch("/api/services"),
        fetch("/api/career-jobs"),
      ]);

      // Check if responses are ok and parse JSON
      const parseResponse = async (res: Response, isServices = false) => {
        if (!res.ok) {
          console.error(`Failed to fetch: ${res.status} ${res.statusText}`);
          return [];
        }
        try {
          const data = await res.json();
          // Handle services response which might be nested in a data property
          if (isServices) {
            return Array.isArray(data) ? data : (data.data || []);
          }
          return Array.isArray(data) ? data : [data];
        } catch (e) {
          console.error('Error parsing JSON:', e);
          return [];
        }
      };

      // Parse all responses
      const [
        bookingsData, 
        appsData, 
        blogsData, 
        usersData, 
        servicesData,
        careerJobsData
      ] = await Promise.all([
        parseResponse(bookingsRes),
        parseResponse(appsRes),
        parseResponse(blogsRes),
        usersRes.json().then(data => data.data || []), // Extract users from data property
        parseResponse(servicesRes, true), // Pass true to handle services response
        parseResponse(careerJobsRes)
      ]);

      console.log('Dashboard Data:', {
        bookings: bookingsData.length,
        applications: appsData.length,
        blogs: blogsData.length,
        users: usersData.length,
        services: servicesData.length,
        careerJobs: careerJobsData.length,
        servicesData // Log the actual services data for debugging
      });

      // Calculate total subservices by summing up subService arrays from all services
      const totalSubservices = servicesData.reduce(
        (total: number, service: any) => {
          const subServices = service.subService || [];
          return total + (Array.isArray(subServices) ? subServices.length : 0);
        }, 
        0
      );

      // Calculate user metrics by role
      const userMetrics = usersData.reduce((acc: any, user: any) => {
        if (!user) return acc;
        
        // Get the role and create a display-friendly version
        const role = (user.role || 'user').toLowerCase();
        const displayRole = role.replace('_', ' ');
        
        // Initialize role counter if it doesn't exist
        if (!acc[role]) {
          acc[role] = 0;
        }
        
        // Increment role counter and total
        acc[role]++;
        acc.total++;
        
        return acc;
      }, { total: 0 });
      
      // Add display names for roles with underscores
      if (userMetrics['super_admin']) {
        userMetrics['super admin'] = userMetrics['super_admin'];
      }

      // Update metrics state
      setMetrics({
        bookings: bookingsData.length,
        applications: appsData.length,
        blogs: blogsData.length,
        users: {
          total: userMetrics.total,
          admin: userMetrics.admin || 0,
          staff: userMetrics.staff || 0,
          user: userMetrics.user || 0,
          ...Object.entries(userMetrics)
            .filter(([key]) => !['total', 'admin', 'staff', 'user'].includes(key))
            .reduce((acc, [key, value]) => ({
              ...acc,
              [key]: value
            }), {})
        },
        services: servicesData.length,
        careerJobs: careerJobsData.length,
      });
    } catch (e) {
      console.error("Failed to fetch dashboard metrics", e);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <MetricCard title="Bookings" value={metrics.bookings} loading={loading} />
      <MetricCard title="Applications" value={metrics.applications} loading={loading} />
      <MetricCard title="Blog Posts" value={metrics.blogs} loading={loading} />
      <Card className="p-6 bg-card border border-border hover:border-orange-500 transition-colors relative group">
        <CardHeader className="flex flex-col gap-2 p-0">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">
              Users
            </span>
            <a 
              href="/?section=admin-users"
              className="text-xs text-orange-500 hover:underline hover:text-orange-600 transition-colors"
            >
              View All
            </a>
          </div>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <div className="space-y-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">{metrics.users.total}</span>
                <span className="text-xs text-muted-foreground">Total Users</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(metrics.users)
                  .filter(([key, value]) => {
                    // Skip total and roles with zero count
                    return key !== 'total' && value > 0;
                  })
                  .sort(([roleA], [roleB]) => {
                    // Custom sort to put admin and super admin first
                    const order: Record<string, number> = {
                      'super admin': 1,
                      'admin': 2,
                      'marketing': 3,
                      'staff': 4,
                      'user': 999
                    };
                    return (order[roleA] || 99) - (order[roleB] || 99) || roleA.localeCompare(roleB);
                  })
                  .map(([key, value]) => {
                    // Skip the raw role key if we have a display version
                    if (key === 'super_admin' && metrics.users['super admin'] !== undefined) {
                      return null;
                    }
                    return (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace('_', ' ')}:</span>
                        <span className="font-medium">{value as number}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </CardHeader>
      </Card>
      <MetricCard title="Services" value={metrics.services} loading={loading} />
      <MetricCard title="Career Jobs" value={metrics.careerJobs} loading={loading} />
    </div>
  );
};

export default Dashboard