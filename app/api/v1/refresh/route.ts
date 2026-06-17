import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://albaraka.onlayndokon.uz/api/v1";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { refresh_token } = body;

  if (!refresh_token) {
    return NextResponse.json({ success: false, message: "refresh_token is required" }, { status: 400 });
  }

  const res = await fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
