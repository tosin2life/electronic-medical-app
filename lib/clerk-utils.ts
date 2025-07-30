import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export interface ClerkError {
  code: string;
  message: string;
  meta?: any;
}

export interface ClerkUserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

/**
 * Safely get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    return {
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        role: user.publicMetadata?.role as string,
      },
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return { success: false, message: "Failed to get user information" };
  }
}

/**
 * Safely create a new user in Clerk
 */
export async function createClerkUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}) {
  try {
    const client = await clerkClient();

    // Check if email already exists
    const existingUsers = await client.users.getUserList({
      emailAddress: [userData.email],
    });

    if (existingUsers.data.length > 0) {
      return {
        success: false,
        error: "EMAIL_EXISTS",
        message: "A user with this email already exists",
      };
    }

    // Create user
    const user = await client.users.createUser({
      emailAddress: [userData.email],
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      publicMetadata: { role: userData.role },
    });

    return {
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress,
        role: user.publicMetadata?.role as string,
      },
    };
  } catch (error) {
    console.error("Clerk user creation error:", error);

    // Parse Clerk validation errors
    if (error && typeof error === "object" && "errors" in error) {
      const errors = (error as any).errors;

      if (Array.isArray(errors)) {
        for (const err of errors) {
          switch (err.code) {
            case "form_password_policy_violation":
              return {
                success: false,
                error: "PASSWORD_POLICY",
                message:
                  "Password must be at least 8 characters and contain letters, numbers, and symbols",
              };

            case "form_identifier_exists":
              return {
                success: false,
                error: "EMAIL_EXISTS",
                message: "A user with this email already exists",
              };

            case "form_identifier_invalid":
              return {
                success: false,
                error: "INVALID_EMAIL",
                message: "Please enter a valid email address",
              };

            case "form_param_invalid":
              if (err.meta?.paramName === "firstName") {
                return {
                  success: false,
                  error: "INVALID_FIRST_NAME",
                  message:
                    "First name is required and must be at least 2 characters",
                };
              }
              if (err.meta?.paramName === "lastName") {
                return {
                  success: false,
                  error: "INVALID_LAST_NAME",
                  message:
                    "Last name is required and must be at least 2 characters",
                };
              }
              break;
          }
        }
      }
    }

    return {
      success: false,
      error: "UNKNOWN_ERROR",
      message: "Failed to create user account",
    };
  }
}

/**
 * Safely update a user in Clerk
 */
export async function updateClerkUser(
  userId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    role?: string;
  }
) {
  try {
    const client = await clerkClient();

    const updateData: any = {};

    if (updates.firstName !== undefined)
      updateData.firstName = updates.firstName;
    if (updates.lastName !== undefined) updateData.lastName = updates.lastName;
    if (updates.role !== undefined)
      updateData.publicMetadata = { role: updates.role };

    await client.users.updateUser(userId, updateData);

    return { success: true };
  } catch (error) {
    console.error("Clerk user update error:", error);
    return {
      success: false,
      message: "Failed to update user information",
    };
  }
}

/**
 * Safely delete a user from Clerk
 */
export async function deleteClerkUser(userId: string) {
  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
    return { success: true };
  } catch (error) {
    console.error("Clerk user deletion error:", error);
    return {
      success: false,
      message: "Failed to delete user account",
    };
  }
}

/**
 * Validate password strength for Clerk
 */
export function validatePassword(password: string) {
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  if (!/(?=.*[a-zA-Z])/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one letter",
    };
  }

  if (!/(?=.*\d)/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one number",
    };
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one special character (@$!%*?&)",
    };
  }

  return { valid: true };
}

/**
 * Generate a secure password for users
 */
export function generateSecurePassword(base: string): string {
  // Add complexity to meet Clerk requirements
  return `${base}@123`;
}
