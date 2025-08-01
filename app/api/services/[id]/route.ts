import { NextResponse } from "next/server"

const API_BASE_URL = "https://advanced-tsp.onrender.com/api/services"

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

// Update a service
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In Next.js 13+, we need to explicitly await the params
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Get the token from the request
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Authentication required' 
        },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    
    // Make the request to the external API
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    // Handle the response
    if (!response.ok) {
      const error = await response.text();
      console.error('Error updating service:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to update service',
          error: error || 'Unknown error occurred'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
    
  } catch (error: any) {
    console.error("Error updating service:", error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to update service',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// Delete a service
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In Next.js 13+, we need to explicitly await the params
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Get the token from the request
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Authentication required' 
        },
        { status: 401 }
      );
    }

    console.log(`[DELETE] Deleting service with ID: ${id}`);
    const deleteUrl = `${API_BASE_URL}/${id}`;
    console.log(`[DELETE] Making request to: ${deleteUrl}`);
    
    // Make the request to the external API
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`[DELETE] Response status: ${response.status}`);
    console.log(`[DELETE] Response headers:`, Object.fromEntries(response.headers.entries()));

    // Handle the response
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('[DELETE] Error response text:', errorText);
        // Try to parse as JSON if possible
        try {
          const errorJson = JSON.parse(errorText);
          console.error('[DELETE] Error response JSON:', errorJson);
          errorText = errorJson;
        } catch (e) {
          // Not JSON, use text as is
        }
      } catch (e) {
        errorText = 'Failed to read error response';
      }
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to delete service',
          error: errorText || 'Unknown error occurred',
          status: response.status,
          statusText: response.statusText,
          url: deleteUrl
        },
        { status: response.status }
      );
    }

    // For 204 No Content responses
    if (response.status === 204) {
      console.log('[DELETE] Service deleted successfully (204 No Content)');
      return NextResponse.json({
        success: true,
        data: { _id: id },
        message: 'Service deleted successfully'
      });
    }

    // For responses with content
    try {
      const responseData = await response.json();
      console.log('[DELETE] Service deleted successfully with response:', responseData);
      return NextResponse.json({
        success: true,
        data: responseData.data || { _id: id },
        message: 'Service deleted successfully'
      });
    } catch (e) {
      console.error('[DELETE] Failed to parse JSON response:', e);
      return NextResponse.json({
        success: true,
        data: { _id: id },
        message: 'Service deleted successfully (non-JSON response)'
      });
    }
    
  } catch (error: any) {
    console.error('[DELETE] Unhandled error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error.message || 'Unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Handle sub-service operations
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In Next.js 13+, we need to explicitly await the params
    const resolvedParams = await Promise.resolve(params);
    const { id: serviceId } = resolvedParams;
    
    if (!serviceId) {
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Get the token from the request
    const token = getAuthToken(request);
    if (!token) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Authentication required' 
        },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    console.log('PATCH request body:', body);
    
    // The frontend is sending the sub-service data directly, not wrapped in an action
    const subServiceData = body;
    
    // Make the request to the external API
    const response = await fetch(`${API_BASE_URL}/${serviceId}/sub-services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(subServiceData)
    });

    // Handle the response
    if (!response.ok) {
      const error = await response.text();
      console.error('Error creating sub-service:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to create sub-service',
          error: error || 'Unknown error occurred'
        },
        { status: response.status }
      );
    }
    
    const responseData = await response.json();
    
    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Sub-service created successfully'
    });
    
  } catch (error: any) {
    console.error(`Error in sub-service operation:`, error)
    return NextResponse.json(
      { 
        success: false,
        message: error.message || 'Failed to perform sub-service operation',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 