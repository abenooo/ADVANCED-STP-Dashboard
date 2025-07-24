import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Corrected external API URL
    const externalApiUrl = "https://advacned-tsp.onrender.com/api/services"
    const response = await fetch(externalApiUrl)

    if (!response.ok) {
      // If the external API returns an error, propagate it
      return new NextResponse(JSON.stringify({ error: `Failed to fetch from external API: ${response.statusText}` }), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in API proxy:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
