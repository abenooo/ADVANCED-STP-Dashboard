import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://advacned-tsp.onrender.com/api'

function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token|authToken)=([^;]*)/)
  let token = match?.[2] || null
  if (!token) token = request.headers.get('authorization')?.split(' ')[1] || null
  return token
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string; subSlug: string }> }) {
  const { slug, subSlug } = await params
  const token = getAuthToken(request)
  if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
  try {
    const body = await request.text()
    const upstream = await fetch(`${API_BASE_URL}/services/${encodeURIComponent(slug)}/sub-services/${encodeURIComponent(subSlug)}`, {
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

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string; subSlug: string }> }) {
  const { slug, subSlug } = await params
  const token = getAuthToken(request)
  if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
  try {
    const upstream = await fetch(`${API_BASE_URL}/services/${encodeURIComponent(slug)}/sub-services/${encodeURIComponent(subSlug)}`, {
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

