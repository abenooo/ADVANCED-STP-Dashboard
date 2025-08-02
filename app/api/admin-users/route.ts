import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const backendUrl = "https://advacned-tsp.onrender.com/api/admin-users";
  console.log('Making request to backend URL:', backendUrl);
  
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
    const token = match ? match[2] : null;
    console.log('Auth token found:', !!token);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
    
    console.log('Request headers:', JSON.stringify(headers, null, 2));
    
    const res = await fetch(backendUrl, { headers });
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      let errorData;
      try {
        errorData = await res.text();
        console.log('Error response text:', errorData);
        errorData = JSON.parse(errorData);
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      
      return NextResponse.json(
        { 
          message: errorData?.message || 'Failed to fetch users',
          status: res.status,
          statusText: res.statusText,
          url: backendUrl
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/admin-users:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : String(error),
        url: backendUrl
      },
      { status: 500 }
    );
  }
}

// Generate random password function
function generateRandomPassword(length: number = 8): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(token|access_token)=([^;]*)/);
  const token = match ? match[2] : null;

  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await request.json();
  
  // Generate random password if not provided (for new users)
  if (!body.password) {
    body.password = generateRandomPassword(8);
  }
  
  const res = await fetch("https://advacned-tsp.onrender.com/api/admin-users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  
  const data = await res.json();
  
  // If user creation was successful and we generated a password, send email
  if (res.ok && !request.headers.get('x-skip-email')) {
    try {
      console.log('Attempting to send welcome email to:', body.email);
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-welcome-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "cookie": request.headers.get("cookie") || "", // Forward cookies for auth
        },
        body: JSON.stringify({
          email: body.email,
          name: body.name,
          password: body.password,
          role: body.role
        }),
      });
      
      console.log('Email API response status:', emailResponse.status);
      
      if (!emailResponse.ok) {
        const emailError = await emailResponse.text();
        console.error('Email API error response:', emailError);
        
        // Add the email error to the response so frontend can show it
        return NextResponse.json({
          ...data,
          emailWarning: `User created successfully, but welcome email failed to send. Email API returned: ${emailResponse.status} - ${emailError}`
        }, { status: res.status });
      } else {
        console.log('Welcome email sent successfully');
      }
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      
      // Add the email error to the response so frontend can show it
      return NextResponse.json({
        ...data,
        emailWarning: `User created successfully, but welcome email failed to send. Error: ${emailError instanceof Error ? emailError.message : String(emailError)}`
      }, { status: res.status });
    }
  }
  
  return NextResponse.json(data, { status: res.status });
}


