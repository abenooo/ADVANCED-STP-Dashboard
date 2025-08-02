import { NextRequest, NextResponse } from "next/server";

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

export async function PUT(request: NextRequest) {
  // Extract jwt token from cookies
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication required" }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { _id, ...updateData } = await request.json();
    
    if (!_id) {
      return new NextResponse(
        JSON.stringify({ error: "Booking ID is required" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const externalUrl = `https://advacned-tsp.onrender.com/api/bookings/${_id}`;
    const res = await fetch(externalUrl, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return new NextResponse(
        JSON.stringify({ 
          error: errorData.message || 'Failed to update booking',
          details: errorData
        }), 
        { 
          status: res.status, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (err: any) {
    console.error('Error updating booking:', err);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error", 
        details: process.env.NODE_ENV === 'development' ? err.message : undefined 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(request: NextRequest) {
  // Extract jwt token from cookies
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;

  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: "Authentication required" }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { bookingId, status } = await request.json();
    
    if (!bookingId || !status) {
      return new NextResponse(
        JSON.stringify({ error: "Booking ID and status are required" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const externalUrl = `https://advacned-tsp.onrender.com/api/bookings/${bookingId}`;
    const res = await fetch(externalUrl, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return new NextResponse(
        JSON.stringify({ 
          error: errorData.message || 'Failed to update booking status',
          details: errorData
        }), 
        { 
          status: res.status, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (err: any) {
    console.error('Error updating booking status:', err);
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error", 
        details: process.env.NODE_ENV === 'development' ? err.message : undefined 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
