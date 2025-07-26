
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
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, loading, className }) => {
  return (
    <Card className={cn("p-6 bg-card border-border", className)}>
      <CardHeader className="flex flex-col gap-2 p-0">
        <span className="text-sm text-muted-foreground uppercase tracking-wide font-semibold">
          {title}
        </span>
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : (
          <span className="text-2xl font-bold text-foreground">{value}</span>
        )}
      </CardHeader>
    </Card>
  );
};

interface DashboardMetrics {
  bookings: number;
  applications: number;
  blogs: number;
  users: number;
  services: number;
  subservices: number;
  careerJobs: number;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    bookings: 0,
    applications: 0,
    blogs: 0,
    users: 0,
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

      setMetrics({
        bookings: bookingsData.length || 0,
        applications: appsData.length || 0,
        blogs: blogsData.length || 0,
        users: usersData.length || 0,
        services: servicesData.length || 0,
        subservices: 0,  // This is still 0 as per your original code
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
      <MetricCard title="Users" value={metrics.users} loading={loading} />
      <MetricCard title="Services" value={metrics.services} loading={loading} />
      <MetricCard title="Sub Services" value={metrics.subservices} loading={loading} />
      <MetricCard title="Career Jobs" value={metrics.careerJobs} loading={loading} />
    </div>
  );
};

export default Dashboard