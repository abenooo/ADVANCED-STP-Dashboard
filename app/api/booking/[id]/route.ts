import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Extract jwt token from cookies
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;

  if (!token) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Authentication required" }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Await params before destructuring
    const { id: bookingId } = await Promise.resolve(params);
    const updateData = await request.json();
    
    if (!bookingId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Booking ID is required" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const externalUrl = `https://advacned-tsp.onrender.com/api/bookings/${bookingId}`;
    const res = await fetch(externalUrl, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData),
    });

    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: responseData.message || 'Failed to update booking',
          error: responseData.error
        }), 
        { 
          status: res.status, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: responseData.data || responseData
    });
    
  } catch (err: any) {
    console.error('Error updating booking:', err);
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Extract jwt token from cookies
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;

  if (!token) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Authentication required" }), 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Await params before destructuring
    const { id: bookingId } = await Promise.resolve(params);
    
    if (!bookingId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Booking ID is required" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const externalUrl = `https://advacned-tsp.onrender.com/api/bookings/${bookingId}`;
    const res = await fetch(externalUrl, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: responseData.message || 'Failed to delete booking',
          error: responseData.error
        }), 
        { 
          status: res.status, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ 
        success: true,
        message: 'Booking deleted successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (err: any) {
    console.error('Error deleting booking:', err);
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}