"use client";
import React, { useEffect, useState } from "react";

// Fetch bookings from your API
async function getBookings() {
  const res = await fetch("https://advacned-tsp.onrender.com/api/bookings");
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

const statusColors = {
  Confirmed: "text-green-400",
  Pending: "text-yellow-400",
  Cancelled: "text-red-400",
};

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-start py-16 px-4">
      <h1 className="text-5xl font-extrabold text-orange-500 mb-2 text-center">Booking</h1>
      <p className="text-gray-400 text-lg mb-10 text-center">
        Schedule and manage your bookings. This page is under construction.
      </p>
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {loading ? (
          <div className="text-gray-300 text-center">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-400 text-center">No bookings found.</div>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              className="bg-neutral-800 rounded-2xl shadow p-6"
            >
              <div className="text-2xl font-bold text-white mb-1">{b.title}</div>
              <div className="text-gray-300 mb-1">
                <span className="font-medium">Client:</span> {b.client}
              </div>
              <div className="text-gray-400">
                Date:{" "}
                {b.date
                  ? new Date(b.date).toLocaleDateString() +
                    " at " +
                    new Date(b.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "-"}
                {" | "}
                <span className={statusColors[b.status] || "text-gray-400"}>
                  Status: {b.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
