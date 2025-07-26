'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface Service {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Booking {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: Service;
  subServiceSlug: string;
  task: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  handledBy: User;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/booking');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (bookings.length === 0) {
    return <div className="text-center py-8 text-gray-400">No bookings found.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => (
        <Card 
          key={booking._id} 
          className="border-border bg-card hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-foreground">{booking.customerName}</CardTitle>
                <CardDescription className="text-muted-foreground">{booking.customerEmail}</CardDescription>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                booking.status === 'completed' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                booking.status === 'cancelled' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
              }`}>
                {booking.status}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-foreground">
                <span className="text-muted-foreground">Service:</span> {booking.serviceId?.name || 'N/A'}
              </p>
              <p className="text-foreground">
                <span className="text-muted-foreground">Phone:</span> {booking.customerPhone}
              </p>
              <p className="text-foreground">
                <span className="text-muted-foreground">Task:</span> {booking.task}
              </p>
              <p className="text-foreground">
                <span className="text-muted-foreground">Handled by:</span> {booking.handledBy?.name || 'Unassigned'}
              </p>
              {booking.notes && (
                <div className="mt-2 p-3 bg-muted/30 rounded-md">
                  <p className="text-muted-foreground text-xs mb-1">Notes:</p>
                  <p className="text-foreground text-sm">{booking.notes}</p>
                </div>
              )}
              <p className="text-muted-foreground/70 text-xs mt-3">
                Created: {new Date(booking.createdAt).toLocaleString()}
                <br />
                Scheduled: {new Date(booking.date).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}