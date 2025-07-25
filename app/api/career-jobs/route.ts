// app/api/career-jobs/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch("https://advacned-tsp.onrender.com/api/career-jobs");
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch("https://advacned-tsp.onrender.com/api/career-jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

// Add PUT and DELETE if needed for update/delete via proxy