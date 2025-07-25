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
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1, // 1 week
  });

  return response;
}
