import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const backendUrl = "https://advanced-tsp.onrender.com/api/admin-users";
  console.log('Making request to backend URL:', backendUrl);
  
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
    const token = match ? match[2] : null;
    console.log('Auth token found:', !!token);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    console.log('Request headers:', JSON.stringify(headers, null, 2));
    
    const res = await fetch(backendUrl, { headers });
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.text();
        console.log('Error response text:', errorData);
        errorData = JSON.parse(errorData);
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      return NextResponse.json(
        { 
          message: errorData?.message || 'Failed to fetch users',
          status: res.status,
          statusText: res.statusText,
          url: backendUrl
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/admin-users:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
        url: backendUrl
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;
  
  const body = await request.json();
  const res = await fetch("https://advanced-tsp.onrender.com/api/admin-users", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;
  
  const body = await request.json();
  const res = await fetch(`https://advanced-tsp.onrender.com/api/admin-users/${params.id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;
  
  const res = await fetch(`https://advanced-tsp.onrender.com/api/admin-users/${params.id}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json();
  return NextResponse.json(data);
}
