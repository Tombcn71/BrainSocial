"use server";

import { cookies } from "next/headers";
import sql from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email en wachtwoord zijn verplicht" };
  }

  try {
    // Find user by email
    const result =
      await sql`SELECT id, password FROM users WHERE email = ${email}`;

    if (!result || result.length === 0) {
      // For development/testing, allow a test login
      if (
        process.env.NODE_ENV &&
        process.env.NODE_ENV.includes("dev") &&
        email === "test@example.com" &&
        password === "password123"
      ) {
        const testUserId = "test-user-id";
        (await cookies()).set("auth", testUserId, {
          httpOnly: true,
          secure: process.env.NODE_ENV.includes("prod"),
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        });
        return { success: true, userId: testUserId };
      }

      console.log("User not found:", email);
      return { success: false, error: "Ongeldige email of wachtwoord" };
    }

    const user = result[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password mismatch for user:", email);
      return { success: false, error: "Ongeldige email of wachtwoord" };
    }

    // Set auth cookie
    (
      await // Set auth cookie
      cookies()
    ).set("auth", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV && process.env.NODE_ENV.includes("prod"),
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, userId: user.id };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Er is een fout opgetreden tijdens het inloggen",
    };
  }
}

export async function logout() {
  (await cookies()).delete("auth");
  return { success: true };
}

export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const plan = (formData.get("plan") as string) || "starter";

  try {
    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;

    if (existingUser.length > 0) {
      return { success: false, error: "Email already in use" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate UUID
    const userId = uuidv4();

    // Create user
    await sql`
      INSERT INTO users (id, name, email, password) 
      VALUES (${userId}, ${name}, ${email}, ${hashedPassword})
    `;

    // Create subscription
    await sql`
      INSERT INTO subscriptions (user_id, plan, status) 
      VALUES (${userId}, ${plan}, 'active')
    `;

    // Set auth cookie
    (
      await // Set auth cookie
      cookies()
    ).set("auth", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV && process.env.NODE_ENV.includes("prod"),
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, userId };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "An error occurred during signup" };
  }
}

export async function getCurrentUser() {
  const userId = (await cookies()).get("auth")?.value;

  if (!userId) {
    return null;
  }

  try {
    const result =
      await sql`SELECT id, name, email, image FROM users WHERE id = ${userId}`;

    return result[0] || null;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
