"use server";

import db from "@/lib/db";
import { PatientFormSchema } from "@/lib/schema";
import { clerkClient } from "@clerk/nextjs/server";

export async function updatePatient(data: any, pid: string) {
  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        msg: "Provide all required fields",
      };
    }

    const patientData = validateData.data;

    const client = await clerkClient();
    await client.users.updateUser(pid, {
      firstName: patientData.first_name,
      lastName: patientData.last_name,
    });

    await db.patient.update({
      data: {
        ...patientData,
      },
      where: { id: pid },
    });

    return {
      success: true,
      error: false,
      msg: "Patient info updated successfully",
    };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: true, msg: error?.message };
  }
}
export async function createNewPatient(data: any, pid: string) {
  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        msg: "Provide all required fields",
      };
    }

    const patientData = validateData.data;
    let patient_id = pid;

    const client = await clerkClient();
    if (pid === "new-patient") {
      const user = await client.users.createUser({
        emailAddress: [patientData.email],
        password: patientData.phone,
        firstName: patientData.first_name,
        lastName: patientData.last_name,
        publicMetadata: { role: "patient" },
      });

      patient_id = user?.id;
    } else {
      await client.users.updateUser(pid, {
        publicMetadata: { role: "patient" },
      });
    }

    await db.patient.create({
      data: {
        ...patientData,
        id: patient_id,
        privacy_consent: patientData.privacy_consent ?? false,
        service_consent: patientData.service_consent ?? false,
        medical_consent: patientData.medical_consent ?? false,
      },
    });

    return { success: true, error: false, msg: "Patient created successfully" };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: true, msg: error?.message };
  }
}

export async function createPatientFromForm(data: any) {
  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        message: "Please provide all required fields",
      };
    }

    const patientData = validateData.data;

    const client = await clerkClient();

    // Validate required fields for Clerk
    if (!patientData.email || !patientData.phone) {
      return {
        success: false,
        error: true,
        message: "Email and phone number are required",
      };
    }

    // Create a proper password from phone number
    const password = `${patientData.phone}@123`; // Add complexity to meet Clerk requirements

    // Check if email already exists
    try {
      const existingUser = await client.users.getUserList({
        emailAddress: [patientData.email],
      });

      if (existingUser.data.length > 0) {
        return {
          success: false,
          error: true,
          message: "A user with this email already exists",
        };
      }
    } catch (error) {
      console.log("Error checking existing user:", error);
    }

    // Create user in Clerk
    const user = await client.users.createUser({
      emailAddress: [patientData.email],
      password: password,
      firstName: patientData.first_name,
      lastName: patientData.last_name,
      publicMetadata: { role: "patient" },
    });

    // Create patient in database
    await db.patient.create({
      data: {
        ...patientData,
        id: user.id,
        privacy_consent: patientData.privacy_consent ?? false,
        service_consent: patientData.service_consent ?? false,
        medical_consent: patientData.medical_consent ?? false,
      },
    });

    return {
      success: true,
      error: false,
      message: "Patient created successfully",
    };
  } catch (error: any) {
    console.log("Clerk error details:", error);

    // Parse Clerk validation errors and return user-friendly messages
    if (error && typeof error === "object" && "errors" in error) {
      console.log("Validation errors:", error.errors);

      if (Array.isArray(error.errors)) {
        for (const err of error.errors) {
          // Handle password validation errors
          if (err.code === "form_password_policy_violation") {
            return {
              error: true,
              success: false,
              message: "Password must meet security requirements",
            };
          }

          // Handle email validation errors
          if (err.code === "form_identifier_exists") {
            return {
              error: true,
              success: false,
              message: "A user with this email already exists",
            };
          }

          // Handle email format errors
          if (err.code === "form_identifier_invalid") {
            return {
              error: true,
              success: false,
              message: "Please enter a valid email address",
            };
          }

          // Handle name validation errors
          if (
            err.code === "form_param_invalid" &&
            err.meta?.paramName === "firstName"
          ) {
            return {
              error: true,
              success: false,
              message:
                "First name is required and must be at least 2 characters",
            };
          }

          if (
            err.code === "form_param_invalid" &&
            err.meta?.paramName === "lastName"
          ) {
            return {
              error: true,
              success: false,
              message:
                "Last name is required and must be at least 2 characters",
            };
          }
        }

        // If no specific error was matched, return the first error message
        if (error.errors.length > 0) {
          return {
            error: true,
            success: false,
            message: error.errors[0].message || "Validation error occurred",
          };
        }
      }
    }

    return {
      success: false,
      error: true,
      message: error?.message || "Something went wrong",
    };
  }
}
