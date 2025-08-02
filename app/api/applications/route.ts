import { NextResponse } from "next/server";

const API_BASE_URL = "https://advacned-tsp.onrender.com/api/applications";

// Helper function to get token from request
function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  let token = match ? match[2] : null;
  
  // Fallback to Authorization header
  if (!token) {
    const authHeader = request.headers.get('authorization');
    token = authHeader?.split(' ')[1] || null;
  }
  
  return token;
}

// GET - Fetch all applications or get by ID
export async function GET(request: Request) {
  const token = getAuthToken(request);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const url = id ? `${API_BASE_URL}/${id}` : API_BASE_URL;
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      const errorMessage = id ? "Failed to fetch application" : "Failed to fetch applications";
      return new NextResponse(
        JSON.stringify({ error: errorMessage, status: res.status }),
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

// POST - Create new application
export async function POST(request: Request) {
  const token = getAuthToken(request);
  
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to create application' }));
      return NextResponse.json(
        errorData,
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

// PUT - Update application
export async function PUT(request: Request) {
  const token = getAuthToken(request);
  
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to update application' }));
      return NextResponse.json(
        errorData,
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete application
export async function DELETE(request: Request) {
  const token = getAuthToken(request);
  
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Failed to delete application' }));
      return NextResponse.json(
        errorData,
        { status: res.status }
      );
    }

    // Handle both JSON and non-JSON responses
    let data;
    try {
      data = await res.json();
    } catch (e) {
      // If response is not JSON, return success message
      data = { success: true, message: 'Application deleted successfully' };
    }
    
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
