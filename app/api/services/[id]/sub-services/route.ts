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

// Protected POST - create sub-service
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // In Next.js 13+, we need to explicitly await the params
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    if (!id) {
      console.error('[SUBSERVICE-POST] Error: Service ID is required');
      return NextResponse.json(
        { success: false, message: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Get the token from the request
    const token = getAuthToken(request);
    if (!token) {
      console.error('[SUBSERVICE-POST] Error: Authentication token not found');
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
    console.log('[SUBSERVICE-POST] Creating sub-service with data:', {
      serviceId: id,
      ...body
    });
    
    const subServiceUrl = `${API_BASE_URL}/${id}/sub-services`;
    console.log('[SUBSERVICE-POST] Making request to:', subServiceUrl);
    
    // Make the request to the external API
    const response = await fetch(subServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    console.log('[SUBSERVICE-POST] Response status:', response.status);
    console.log('[SUBSERVICE-POST] Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Handle the response
    if (!response.ok) {
      let errorText;
      try {
        errorText = await response.text();
        console.error('[SUBSERVICE-POST] Error response text:', errorText);
        // Try to parse as JSON if possible
        try {
          const errorJson = JSON.parse(errorText);
          console.error('[SUBSERVICE-POST] Error response JSON:', errorJson);
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
          message: 'Failed to create sub-service',
          error: errorText || 'Unknown error occurred',
          status: response.status,
          statusText: response.statusText,
          url: subServiceUrl
        },
        { status: response.status }
      );
    }
    
    try {
      const responseData = await response.json();
      console.log('[SUBSERVICE-POST] Sub-service created successfully:', responseData);
      
      return NextResponse.json({
        success: true,
        data: responseData,
        message: 'Sub-service created successfully'
      });
    } catch (e) {
      console.error('[SUBSERVICE-POST] Error parsing JSON response:', e);
      return NextResponse.json({
        success: true,
        message: 'Sub-service created successfully (non-JSON response)'
      });
    }
    
  } catch (error: any) {
    console.error('[SUBSERVICE-POST] Unhandled error:', error);
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

// Protected PUT - update sub-service
export async function PUT(
  request: Request,
  { params }: { params: { id: string; subServiceId: string } }
) {
  try {
    // In Next.js 13+, we need to explicitly await the params
    const resolvedParams = await Promise.resolve(params);
    const { id, subServiceId } = resolvedParams;
    
    if (!id || !subServiceId) {
      return NextResponse.json(
        { success: false, message: 'Service ID and sub-service ID are required' },
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
    console.log('Updating sub-service with data:', body);
    
    // Make the request to the external API
    const response = await fetch(`${API_BASE_URL}/${id}/sub-services/${subServiceId}`, {
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
      console.error('Error updating sub-service:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to update sub-service',
          error: error || 'Unknown error occurred'
        },
        { status: response.status }
      );
    }
    
    const responseData = await response.json();
    
    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Sub-service updated successfully'
    });
    
  } catch (error: any) {
    console.error('Error in sub-service update:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Protected DELETE - delete sub-service
export async function DELETE(
  request: Request,
  { params }: { params: { id: string; subServiceId: string } }
) {
  try {
    // In Next.js 13+, we need to explicitly await the params
    const resolvedParams = await Promise.resolve(params);
    const { id, subServiceId } = resolvedParams;
    
    if (!id || !subServiceId) {
      return NextResponse.json(
        { success: false, message: 'Service ID and sub-service ID are required' },
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

    // Make the request to the external API
    const response = await fetch(`${API_BASE_URL}/${id}/sub-services/${subServiceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    
    // Handle the response
    if (!response.ok) {
      const error = await response.text();
      console.error('Error deleting sub-service:', error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to delete sub-service',
          error: error || 'Unknown error occurred'
        },
        { status: response.status }
      );
    }
    
    const responseData = await response.json();
    
    return NextResponse.json({
      success: true,
      data: responseData,
      message: 'Sub-service deleted successfully'
    });
    
  } catch (error: any) {
    console.error('Error in sub-service deletion:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error.message || 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}