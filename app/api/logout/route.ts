import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: "Logged out successfully" 
    });

    // Clear the authentication cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // Set expiry to past date to delete cookie
    });

    // Also clear access_token cookie if it exists
    response.cookies.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    console.log('User logged out successfully');

    return response;

  } catch (error) {
    console.error('Error during logout:', error);
    
    return NextResponse.json(
      {
        error: "Failed to logout",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
