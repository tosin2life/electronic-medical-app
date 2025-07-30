import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { checkRole } from "@/utils/roles";

// GET - Get clinical notes with version history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const medicalRecordId = parseInt(id);

    let clinicalNotes;
    try {
      clinicalNotes = await db.$queryRaw`
        SELECT 
          cnv.id,
          cnv.notes,
          cnv.version_number,
          cnv.change_reason,
          cnv.is_current,
          cnv.created_at,
          d.name as doctor_name,
          d.specialization as doctor_specialization
        FROM "ClinicalNotesVersion" cnv
        LEFT JOIN "Doctor" d ON cnv.doctor_id = d.id
        WHERE cnv.medical_record_id = ${medicalRecordId}
        ORDER BY cnv.version_number DESC
      `;
    } catch (error) {
      // If table doesn't exist yet, return empty array
      console.log(
        "ClinicalNotesVersion table not found, returning empty array"
      );
      clinicalNotes = [];
    }

    return NextResponse.json({
      success: true,
      data: clinicalNotes,
    });
  } catch (error) {
    console.error("Error fetching clinical notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch clinical notes" },
      { status: 500 }
    );
  }
}

// POST - Create new version of clinical notes
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a doctor
    const isDoctor = await checkRole("DOCTOR");
    if (!isDoctor) {
      return NextResponse.json(
        { error: "Only doctors can edit clinical notes" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const medicalRecordId = parseInt(id);
    const { notes, change_reason } = await request.json();

    if (!notes) {
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 }
      );
    }

    // Get the doctor ID from the medical record
    const medicalRecord = await db.medicalRecords.findUnique({
      where: { id: medicalRecordId },
      select: { doctor_id: true },
    });

    if (!medicalRecord) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 }
      );
    }

    // Get the latest version number
    let latestVersionResult: any[] = [];
    try {
      latestVersionResult = (await db.$queryRaw`
        SELECT version_number 
        FROM "ClinicalNotesVersion" 
        WHERE medical_record_id = ${medicalRecordId}
        ORDER BY version_number DESC 
        LIMIT 1
      `) as any[];
    } catch (error) {
      console.log(
        "ClinicalNotesVersion table not found, starting with version 1"
      );
      latestVersionResult = [];
    }

    const latestVersion = latestVersionResult[0] as
      | { version_number: number }
      | undefined;
    const newVersionNumber = (latestVersion?.version_number || 0) + 1;

    // Set all previous versions as not current
    try {
      await db.$executeRaw`
        UPDATE "ClinicalNotesVersion" 
        SET is_current = false 
        WHERE medical_record_id = ${medicalRecordId}
      `;
    } catch (error) {
      console.log("No existing versions to update");
    }

    // Create new version
    let newVersionResult: any[] = [];
    try {
      newVersionResult = (await db.$queryRaw`
        INSERT INTO "ClinicalNotesVersion" (
          medical_record_id, 
          doctor_id, 
          notes, 
          version_number, 
          change_reason, 
          is_current, 
          created_at, 
          updated_at
        ) VALUES (
          ${medicalRecordId}, 
          ${medicalRecord.doctor_id}, 
          ${notes}, 
          ${newVersionNumber}, 
          ${change_reason || null}, 
          true, 
          NOW(), 
          NOW()
        ) RETURNING *
      `) as any[];
    } catch (error) {
      console.error("Failed to create clinical notes version:", error);
      return NextResponse.json(
        {
          error:
            "Failed to create clinical notes version - table may not exist",
        },
        { status: 500 }
      );
    }

    const newVersion = newVersionResult[0] as any;

    // Update the main medical record notes field
    await db.medicalRecords.update({
      where: { id: medicalRecordId },
      data: { notes },
    });

    return NextResponse.json({
      success: true,
      data: newVersion,
    });
  } catch (error) {
    console.error("Error creating clinical notes version:", error);
    return NextResponse.json(
      { error: "Failed to create clinical notes version" },
      { status: 500 }
    );
  }
}
