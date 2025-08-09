import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://advacned-tsp.onrender.com/api"

function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || ""
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token|authToken)=([^;]*)/)
  let token = match?.[2] || null
  if (!token) token = request.headers.get("authorization")?.split(" ")[1] || null
  return token
}

async function authedFetch(url: string, method: string, token: string, body?: any) {
  const headers: HeadersInit = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    const text = await res.text()
    return NextResponse.json({ success: false, message: text }, { status: res.status })
  }
  const data = await res.json()
  if (!res.ok) {
    return NextResponse.json({ success: false, ...data, message: data?.message || 'Request failed' }, { status: res.status })
  }
  return NextResponse.json(data, { status: res.status })
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const token = getAuthToken(request)
  if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  return authedFetch(`${API_BASE_URL}/services/${encodeURIComponent(slug)}/sub-services`, 'POST', token, body)
}
