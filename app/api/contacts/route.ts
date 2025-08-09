import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://advacned-tsp.onrender.com/api'

function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token|authToken)=([^;]*)/)
  let token = match?.[2] || null
  if (!token) token = request.headers.get('authorization')?.split(' ')[1] || null
  return token
}

export async function GET(request: Request) {
  const token = getAuthToken(request)
  if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
  try {
    const upstream = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    })
    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Failed to fetch contacts' }, { status: 500 })
  }
}
