import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://advacned-tsp.onrender.com/api'

function getAuthToken(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token|authToken)=([^;]*)/)
  let token = match?.[2] || null
  if (!token) token = request.headers.get('authorization')?.split(' ')[1] || null
  return token
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = getAuthToken(request)
  if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  try {
    const upstream = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Failed to update contact' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = getAuthToken(request)
  if (!token) return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
  const { id } = await params
  try {
    const upstream = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    const text = await upstream.text().catch(() => '')
    let data: any
    try { data = JSON.parse(text) } catch { data = { success: upstream.ok } }
    return NextResponse.json(data, { status: upstream.status })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Failed to delete contact' }, { status: 500 })
  }
}
