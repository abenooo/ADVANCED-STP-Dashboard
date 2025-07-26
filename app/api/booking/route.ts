import { NextResponse } from "next/server";

// Proxy to external bookings endpoint, forwarding JWT from cookie

export async function GET(request: Request) {
  // Extract jwt token from cookies
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;

  try {
    const externalUrl = "https://advacned-tsp.onrender.com/api/bookings"; // adjust path if backend differs
    const res = await fetch(externalUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      return new NextResponse(
        JSON.stringify({ error: "Failed to fetch bookings", status: res.status }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
