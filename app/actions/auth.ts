"use server";

import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function syncUserWithDatabase() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    // Get user from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const userRole = clerkUser.publicMetadata?.role as string;

    if (!userRole) {
      return { success: false, message: "User role not found" };
    }

    // Check if user already exists in database
    let existingUser = null;

    switch (userRole) {
      case "doctor":
        existingUser = await db.doctor.findUnique({
          where: { id: userId },
        });
        break;
      case "patient":
        existingUser = await db.patient.findUnique({
          where: { id: userId },
        });
        break;
      case "staff":
        existingUser = await db.staff.findUnique({
          where: { id: userId },
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
            id: userId,
            name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
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
            id: userId,
            first_name: clerkUser.firstName || "",
            last_name: clerkUser.lastName || "",
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
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
            id: userId,
            name: `${clerkUser.firstName} ${clerkUser.lastName}`.trim(),
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
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
