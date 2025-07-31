import { NextResponse } from "next/server"

const API_BASE_URL = "https://advacned-tsp.onrender.com/api/services"
// Helper function to extract token from request
function getAuthToken(request: Request): string | null {
  // Check cookies first
  const cookieHeader = request.headers.get("cookie") || ""
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/)
  let token = match?.[2] || null
  
  // Fallback to Authorization header
  if (!token) {
    token = request.headers.get('authorization')?.split(' ')[1] || null
  }
  
  return token
}

// Helper function to make authenticated requests to the API
async function makeAuthenticatedRequest(
  url: string, 
  method: string, 
  token: string, 
  body?: any
) {
  const headers: HeadersInit = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Handle non-JSON responses
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text()
    throw new Error(`Unexpected response type: ${contentType}, ${text.substring(0, 200)}`)
  }

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`)
  }

  return data
}

// Get all services (public)
export async function GET() {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error fetching services:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch services', error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in GET /api/services:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

// Create a new service (protected)
export async function POST(request: Request) {
  try {
    const token = getAuthToken(request)
    
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Authentication required' 
        },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Basic validation
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Name and slug are required fields' 
        },
        { status: 400 }
      )
    }
    
    const data = await makeAuthenticatedRequest(API_BASE_URL, 'POST', token, body)
    
    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: 'Service created successfully'
    }, { status: 201 })
    
  } catch (error: any) {
    console.error("Error in POST /api/services:", error)
    
    // Handle duplicate key error
    if (error.message && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { 
          success: false,
          message: 'A service with this slug already exists',
          error: 'DUPLICATE_SLUG'
        },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to create service',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
