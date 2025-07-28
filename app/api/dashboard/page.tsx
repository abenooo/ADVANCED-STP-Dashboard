
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
    'Bookings': 'bookings',
    'Applications': 'applications',
    'Blog Posts': 'blog-posts',
    'Users': 'users',
    'Services': 'services',
    'Sub Services': 'sub-services',
    'Career Jobs': 'career-jobs',
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
  subservices: number;
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
    subservices: 0,
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

 // Update the fetchCounts function to calculate subservices count
async function fetchCounts() {
  setLoading(true);
  try {
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

    const [
      bookingsData, 
      appsData, 
      blogsData, 
      usersData, 
      servicesData,
      careerJobsData
    ] = await Promise.all(
      [bookingsRes, appsRes, blogsRes, usersRes, servicesRes, careerJobsRes].map(async (res) => {
        if (!res || !res.ok) return [];
        return res.json();
      })
    );

    // Calculate total subservices by summing up subService arrays from all services
    const totalSubservices = servicesData.reduce(
      (total: number, service: any) => total + (service.subService?.length || 0), 
      0
    );

    // Calculate user metrics by role
    const userMetrics = usersData.reduce((acc: any, user: any) => {
      const role = user.role?.toLowerCase() || 'user';
      acc[role] = (acc[role] || 0) + 1;
      acc.total = (acc.total || 0) + 1;
      return acc;
    }, { total: 0, admin: 0, staff: 0, user: 0 });

    setMetrics({
      bookings: bookingsData.length || 0,
      applications: appsData.length || 0,
      blogs: blogsData.length || 0,
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
      services: servicesData.length || 0,
      subservices: totalSubservices,
      careerJobs: careerJobsData.length || 0,
    });
  } catch (e) {
    console.error("Failed to fetch dashboard metrics", e);
  }
  setLoading(false);
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
              href="/?section=users"
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
                {Object.entries(metrics.users).map(([key, value]) => {
                  if (key === 'total') return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
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
      <MetricCard title="Sub Services" value={metrics.subservices} loading={loading} />
      <MetricCard title="Career Jobs" value={metrics.careerJobs} loading={loading} />
    </div>
  );
};

export default Dashboard