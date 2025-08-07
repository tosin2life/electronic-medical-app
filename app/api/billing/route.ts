import { NextRequest, NextResponse } from "next/server";
import { createBillingRecord } from "@/utils/services/billing";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createBillingRecord(body);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Billing API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
