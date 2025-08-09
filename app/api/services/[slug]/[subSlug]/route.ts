import { NextResponse } from 'next/server'

const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://advacned-tsp.onrender.com/api'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string; subSlug: string }> }) {
  const { slug, subSlug } = await params
  try {
    const res = await fetch(`${PUBLIC_API_BASE}/services/${encodeURIComponent(slug)}/${encodeURIComponent(subSlug)}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json({ success: false, ...data, message: data?.message || 'Failed to fetch sub-service' }, { status: res.status })
    }
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Failed to fetch sub-service' }, { status: 500 })
  }
}

// Helper to get token from cookies or Authorization header
function extractToken(req: Request) {
  const cookieHeader = req.headers.get('cookie') || ''
  const cookieMap = Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('='))) as Record<string, string>
  const bearer = req.headers.get('authorization') || req.headers.get('Authorization')
  return (
    cookieMap['token'] ||
    cookieMap['access_token'] ||
    cookieMap['authToken'] ||
    (bearer?.startsWith('Bearer ') ? bearer.slice(7) : undefined)
  )
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string; subSlug: string }> }) {
  const { slug, subSlug } = await params
  const token = extractToken(req)
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.text()
    const upstream = await fetch(`${PUBLIC_API_BASE}/services/${encodeURIComponent(slug)}/sub-services/${encodeURIComponent(subSlug)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body,
    })
    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Failed to update sub-service' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string; subSlug: string }> }) {
  const { slug, subSlug } = await params
  const token = extractToken(req)
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }
  try {
    const upstream = await fetch(`${PUBLIC_API_BASE}/services/${encodeURIComponent(slug)}/sub-services/${encodeURIComponent(subSlug)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Failed to delete sub-service' }, { status: 500 })
  }
}
