import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Read token from cookies (supports 'token' or 'access_token')
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  let token = match ? match[2] : null;
  // Fallback to Authorization header from client (e.g., SPA fetch)
  if (!token) {
    const auth = request.headers.get("authorization");
    if (auth && auth.startsWith("Bearer ")) token = auth.slice(7);
  }

  const res = await fetch("https://advacned-tsp.onrender.com/api/admin-users", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch("https://advacned-tsp.onrender.com/api/admin-users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

// PUT and DELETE operations for specific users should be handled in dynamic routes like /api/user/[id]/route.ts
// These functions have been removed as they don't belong in the main /api/user route
