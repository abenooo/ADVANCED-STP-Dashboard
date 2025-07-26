import BookingsList from "@/features/bookings/BookingsList";

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Bookings</h1>
        <p className="text-muted-foreground">View and manage all customer bookings.</p>
      </div>
      <BookingsList />
    </div>
  );
}
