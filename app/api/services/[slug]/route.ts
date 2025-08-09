import { NextResponse } from 'next/server'

const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://advacned-tsp.onrender.com/api'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const res = await fetch(`${PUBLIC_API_BASE}/services/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json({ success: false, ...data, message: data?.message || 'Failed to fetch service' }, { status: res.status })
    }
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Failed to fetch service' }, { status: 500 })
  }
}
