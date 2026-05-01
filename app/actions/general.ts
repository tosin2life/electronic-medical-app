"use server";

import {
  ReviewFormValues,
  reviewSchema,
} from "@/components/dialogs/review-form";
import db from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

export async function deleteDataById(
  id: string,
  deleteType:
    | "doctor"
    | "staff"
    | "patient"
    | "payment"
    | "bill"
    | "medical_record"
) {
  let dbDeleteSuccess = false;
  try {
    // First check if the record exists
    let recordExists = false;

    switch (deleteType) {
      case "doctor":
        recordExists =
          (await db.doctor.findUnique({ where: { id: id } })) !== null;
        if (recordExists) {
          await db.doctor.delete({ where: { id: id } });
          dbDeleteSuccess = true;
        }
        break;
      case "staff":
        recordExists =
          (await db.staff.findUnique({ where: { id: id } })) !== null;
        if (recordExists) {
          await db.staff.delete({ where: { id: id } });
          dbDeleteSuccess = true;
        }
        break;
      case "patient":
        recordExists =
          (await db.patient.findUnique({ where: { id: id } })) !== null;
        if (recordExists) {
          await db.patient.delete({ where: { id: id } });
          dbDeleteSuccess = true;
        }
        break;
      case "payment":
        recordExists =
          (await db.payment.findUnique({ where: { id: Number(id) } })) !== null;
        if (recordExists) {
          await db.payment.delete({ where: { id: Number(id) } });
          dbDeleteSuccess = true;
        }
        break;
      case "medical_record":
        recordExists =
          (await db.medicalRecords.findUnique({
            where: { id: Number(id) },
          })) !== null;
        if (recordExists) {
          await db.medicalRecords.delete({ where: { id: Number(id) } });
          dbDeleteSuccess = true;
        }
        break;
    }

    if (!recordExists) {
      return {
        success: false,
        message: "Record not found",
        status: 404,
      };
    }

    if (
      deleteType === "staff" ||
      deleteType === "patient" ||
      deleteType === "doctor"
    ) {
      try {
        const client = await clerkClient();
        await client.users.deleteUser(id);
      } catch (clerkError) {
        // Optionally log the error, but don't fail the whole operation
        console.log("Clerk user deletion error:", clerkError);
      }
    }

    return {
      success: true,
      message: "Data deleted successfully",
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}

export async function createReview(values: ReviewFormValues) {
  try {
    const validatedFields = reviewSchema.parse(values);

    await db.rating.create({
      data: {
        ...validatedFields,
      },
    });

    return {
      success: true,
      message: "Review created successfully",
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}
