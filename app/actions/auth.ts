"use server";

import { getCurrentUser } from "@/lib/clerk-utils";
import db from "@/lib/db";

export async function syncUserWithDatabase() {
  try {
    const userResult = await getCurrentUser();

    if (!userResult.success) {
      return userResult;
    }

    const { user } = userResult;
    
    if (!user) {
      return { success: false, message: "User data not found" };
    }
    
    const userRole = user.role;

    if (!userRole) {
      return { success: false, message: "User role not found" };
    }

    // Check if user already exists in database
    let existingUser = null;

    switch (userRole) {
      case "doctor":
        existingUser = await db.doctor.findUnique({
          where: { id: user.id },
        });
        break;
      case "patient":
        existingUser = await db.patient.findUnique({
          where: { id: user.id },
        });
        break;
      case "staff":
        existingUser = await db.staff.findUnique({
          where: { id: user.id },
        });
        break;
      default:
        return { success: false, message: "Invalid user role" };
    }

    if (existingUser) {
      return { success: true, message: "User already exists in database" };
    }

    // Create user in database based on role
    switch (userRole) {
      case "doctor":
        await db.doctor.create({
          data: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email || "",
            phone: "", // Will need to be updated later
            specialization: "", // Will need to be updated later
            address: "", // Will need to be updated later
            type: "FULL",
            department: "", // Will need to be updated later
            license_number: "", // Will need to be updated later
            colorCode: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
          },
        });
        break;
      case "patient":
        await db.patient.create({
          data: {
            id: user.id,
            first_name: user.firstName || "",
            last_name: user.lastName || "",
            email: user.email || "",
            phone: "", // Will need to be updated later
            address: "", // Will need to be updated later
            date_of_birth: new Date(), // Will need to be updated later
            gender: "MALE", // Will need to be updated later
            marital_status: "single", // Will need to be updated later
            emergency_contact_name: "", // Will need to be updated later
            emergency_contact_number: "", // Will need to be updated later
            relation: "other", // Will need to be updated later
            colorCode: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
            privacy_consent: false,
            service_consent: false,
            medical_consent: false,
          },
        });
        break;
      case "staff":
        await db.staff.create({
          data: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email || "",
            phone: "", // Will need to be updated later
            address: "", // Will need to be updated later
            role: "NURSE", // Will need to be updated later
            department: "", // Will need to be updated later
            license_number: "", // Will need to be updated later
            colorCode: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // Random color
          },
        });
        break;
    }

    return { success: true, message: "User synced with database successfully" };
  } catch (error) {
    console.error("Error syncing user with database:", error);
    return { success: false, message: "Failed to sync user with database" };
  }
}
