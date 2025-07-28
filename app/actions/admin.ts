"use server";
import db from "@/lib/db";
import { DoctorSchema, WorkingDaysSchema, StaffSchema } from "@/lib/schema";
import { clerkClient } from "@clerk/nextjs/server";

export async function createNewDoctor(data: any) {
  try {
    const values = DoctorSchema.safeParse(data);

    const workingDaysValues = WorkingDaysSchema.safeParse(data?.work_schedule);

    if (!values.success || !workingDaysValues.success) {
      return {
        success: false,
        errors: true,
        message: "Please provide all required info",
      };
    }

    const validatedValues = values.data;
    const workingDayData = workingDaysValues.data!;

    const client = await clerkClient();

    // Split name into first and last name, handling cases where there's no space
    const nameParts = validatedValues.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Validate required fields for Clerk
    if (!validatedValues.email || !validatedValues.password) {
      return {
        success: false,
        error: true,
        message: "Email and password are required",
      };
    }

    // Validate password strength for Clerk
    if (validatedValues.password.length < 8) {
      return {
        success: false,
        error: true,
        message: "Password must be at least 8 characters long",
      };
    }

    // Check if email already exists
    try {
      const existingUser = await client.users.getUserList({
        emailAddress: [validatedValues.email],
      });

      if (existingUser.data.length > 0) {
        return {
          success: false,
          error: true,
          message: "User with this email already exists",
        };
      }
    } catch (error) {
      console.log("Error checking existing user:", error);
    }

    const user = await client.users.createUser({
      emailAddress: [validatedValues.email],
      password: validatedValues.password,
      firstName: firstName,
      lastName: lastName,
      publicMetadata: { role: "doctor" },
    });

    const { password, ...doctorData } = validatedValues;

    const doctor = await db.doctor.create({
      data: {
        ...doctorData,
        id: user.id,
      },
    });

    await Promise.all(
      workingDayData?.map((el) =>
        db.workingDays.create({
          data: { ...el, doctor_id: doctor.id },
        })
      )
    );

    return {
      success: true,
      message: "Doctor added successfully",
      error: false,
    };
  } catch (error) {
    console.log("Clerk error details:", error);
    if (error && typeof error === "object" && "errors" in error) {
      console.log("Validation errors:", error.errors);
    }
    return { error: true, success: false, message: "Something went wrong" };
  }
}

export async function createNewStaff(data: any) {
  try {
    const values = StaffSchema.safeParse(data);

    if (!values.success) {
      return {
        success: false,
        errors: true,
        message: "Please provide all required info",
      };
    }

    const validatedValues = values.data;

    const client = await clerkClient();

    // Split name into first and last name, handling cases where there's no space
    const nameParts = validatedValues.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Validate required fields for Clerk
    if (!validatedValues.email || !validatedValues.password) {
      return {
        success: false,
        error: true,
        message: "Email and password are required",
      };
    }

    // Validate password strength for Clerk
    if (validatedValues.password.length < 8) {
      return {
        success: false,
        error: true,
        message: "Password must be at least 8 characters long",
      };
    }

    // Check if email already exists
    try {
      const existingUser = await client.users.getUserList({
        emailAddress: [validatedValues.email],
      });

      if (existingUser.data.length > 0) {
        return {
          success: false,
          error: true,
          message: "User with this email already exists",
        };
      }
    } catch (error) {
      console.log("Error checking existing user:", error);
    }

    const user = await client.users.createUser({
      emailAddress: [validatedValues.email],
      password: validatedValues.password,
      firstName: firstName,
      lastName: lastName,
      publicMetadata: { role: "staff" },
    });

    const { password, ...staffData } = validatedValues;

    const staff = await db.staff.create({
      data: {
        ...staffData,
        id: user.id,
      },
    });

    return {
      success: true,
      message: "Staff added successfully",
      error: false,
    };
  } catch (error) {
    console.log("Clerk error details:", error);
    if (error && typeof error === "object" && "errors" in error) {
      console.log("Validation errors:", error.errors);
    }
    return { error: true, success: false, message: "Something went wrong" };
  }
}
