import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log("Login body:", body); // <-- Add this

  // Forward the login request to your real backend
  const res = await fetch("https://advacned-tsp.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const data = await res.json();
  const token = data.token; // Adjust this if your backend returns a different field

  // Set the token in an HTTP-only cookie
  const response = NextResponse.json({ 
    success: true, 
    token: token, // Also return token in response for debugging
    mustChangePassword: data.user?.mustChangePassword || false 
  });
  
  // Set multiple cookie formats to ensure compatibility
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days (1 week)
  };
  
  response.cookies.set("token", token, cookieOptions);
  response.cookies.set("access_token", token, cookieOptions); // Fallback cookie name

  return response;
}
