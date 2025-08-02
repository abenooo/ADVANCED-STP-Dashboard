import { NextResponse } from "next/server";

const API_BASE_URL = "https://advacned-tsp.onrender.com/api/blog-posts"

// Public route - no authentication required
export async function GET() {
  try {
    const res = await fetch(API_BASE_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch blog posts');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;

  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}


