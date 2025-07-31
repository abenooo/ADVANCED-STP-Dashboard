import { NextResponse } from "next/server"

const API_BASE_URL = "https://advacned-tsp.onrender.com/api/services"

// Protected POST - create sub-service
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check cookies first, then Authorization header
    const cookieHeader = request.headers.get("cookie") || ""
    const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/)
    let token = match?.[2] || null
    
    // Fallback to Authorization header
    if (!token) {
      token = request.headers.get('authorization')?.split(' ')[1] || null
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const response = await fetch(`${API_BASE_URL}/${id}/sub-services`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("Error in POST /api/services/[id]/sub-services:", error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Protected PUT - update sub-service
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; subServiceId: string }> }
) {
  try {
    const { id, subServiceId } = await params
    
    // Check cookies first, then Authorization header
    const cookieHeader = request.headers.get("cookie") || ""
    const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/)
    let token = match?.[2] || null
    
    // Fallback to Authorization header
    if (!token) {
      token = request.headers.get('authorization')?.split(' ')[1] || null
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const response = await fetch(`${API_BASE_URL}/${id}/sub-services/${subServiceId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("Error updating sub-service:", error)
    return NextResponse.json(
      { error: 'Failed to update sub-service' },
      { status: 500 }
    )
  }
}

// Protected DELETE - delete sub-service
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; subServiceId: string }> }
) {
  try {
    const { id, subServiceId } = await params
    
    // Check cookies first, then Authorization header
    const cookieHeader = request.headers.get("cookie") || ""
    const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/)
    let token = match?.[2] || null
    
    // Fallback to Authorization header
    if (!token) {
      token = request.headers.get('authorization')?.split(' ')[1] || null
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/${id}/sub-services/${subServiceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error("Error deleting sub-service:", error)
    return NextResponse.json(
      { error: 'Failed to delete sub-service' },
      { status: 500 }
    )
  }
} 