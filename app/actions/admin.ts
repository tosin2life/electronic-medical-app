"use server";
import db from "@/lib/db";
import { DoctorSchema, WorkingDaysSchema, StaffSchema } from "@/lib/schema";
import { createClerkUser, validatePassword } from "@/lib/clerk-utils";

interface DoctorFormData {
  name: string;
  email: string;
  password: string;
  work_schedule?: Array<{
    day: string;
    start_time: string;
    close_time: string;
  }>;
  [key: string]: unknown;
}

export async function createNewDoctor(data: DoctorFormData) {
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
    const workingDayData = workingDaysValues.data;

    // Split name into first and last name, handling cases where there's no space
    const nameParts = validatedValues.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Validate required fields
    if (!validatedValues.email || !validatedValues.password) {
      return {
        success: false,
        error: true,
        message: "Email and password are required",
      };
    }

    // Validate password strength
    const passwordValidation = validatePassword(validatedValues.password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: true,
        message: passwordValidation.message,
      };
    }

    // Create user in Clerk
    const clerkResult = await createClerkUser({
      email: validatedValues.email,
      password: validatedValues.password,
      firstName,
      lastName,
      role: "doctor",
    });

    if (!clerkResult.success) {
      return {
        success: false,
        error: true,
        message: clerkResult.message,
      };
    }

    const user = clerkResult.user;

    if (!user) {
      return {
        success: false,
        error: true,
        message: "Failed to create user account",
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...doctorData } = validatedValues;

    const doctor = await db.doctor.create({
      data: {
        ...doctorData,
        id: user.id,
      },
    });

    if (workingDayData) {
      await Promise.all(
        workingDayData.map((el) =>
          db.workingDays.create({
            data: { ...el, doctor_id: doctor.id },
          })
        )
      );
    }

    return {
      success: true,
      message: "Doctor added successfully",
      error: false,
    };
  } catch (error) {
    console.error("Error creating doctor:", error);
    return { error: true, success: false, message: "Failed to create doctor" };
  }
}

interface StaffFormData {
  name: string;
  email: string;
  password?: string;
  [key: string]: unknown;
}

export async function createNewStaff(data: StaffFormData) {
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

    // Split name into first and last name, handling cases where there's no space
    const nameParts = validatedValues.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Validate required fields
    if (!validatedValues.email || !validatedValues.password) {
      return {
        success: false,
        error: true,
        message: "Email and password are required",
      };
    }

    // Validate password strength
    const passwordValidation = validatePassword(validatedValues.password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: true,
        message: passwordValidation.message,
      };
    }

    // Create user in Clerk
    const clerkResult = await createClerkUser({
      email: validatedValues.email,
      password: validatedValues.password,
      firstName,
      lastName,
      role: "staff",
    });

    if (!clerkResult.success) {
      return {
        success: false,
        error: true,
        message: clerkResult.message,
      };
    }

    const user = clerkResult.user;

    if (!user) {
      return {
        success: false,
        error: true,
        message: "Failed to create user account",
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...staffData } = validatedValues;

    await db.staff.create({
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
    console.error("Error creating staff:", error);
    return { error: true, success: false, message: "Failed to create staff" };
  }
}
