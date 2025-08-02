import { NextResponse } from "next/server";

// Proxy to external bookings endpoint, forwarding JWT from cookie
export async function GET(request: Request) {
  // Extract jwt token from cookies
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;

  try {
    const externalUrl = "https://advacned-tsp.onrender.com/api/bookings";
    const res = await fetch(externalUrl, {
      headers: token ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : { 'Content-Type': 'application/json' },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error('Failed to fetch bookings:', res.status, res.statusText);
      // Return empty array instead of error to prevent UI breakage
      return NextResponse.json([], { 
        status: 200,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const responseData = await res.json();
    
    // Extract the data array from the response
    const bookings = Array.isArray(responseData?.data) 
      ? responseData.data 
      : [];
    
    return NextResponse.json(bookings, { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } catch (err: any) {
    console.error('Error fetching bookings:', err);
    // Return empty array on error to prevent UI breakage
    return NextResponse.json([], { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
