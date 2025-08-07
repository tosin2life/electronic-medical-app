import { NextRequest, NextResponse } from "next/server";
import { getServicesByType } from "@/utils/services/billing";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const result = await getServicesByType(type || undefined);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Services API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
