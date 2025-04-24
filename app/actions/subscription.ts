"use server";

import sql from "@/lib/db";
import { cookies } from "next/headers";

export async function getUserSubscription() {
  const userId = (await cookies()).get("auth")?.value;

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const result =
      await sql`SELECT * FROM subscriptions WHERE user_id = ${userId}`;

    return { success: true, subscription: result[0] };
  } catch (error) {
    console.error("Get user subscription error:", error);
    return { success: false, error: "Failed to get subscription" };
  }
}

export async function createCheckoutSession(
  plan: "starter" | "pro" | "business",
  returnUrl: string
) {
  const userId = (await cookies()).get("auth")?.value;

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  // This would be replaced with actual Stripe integration
  // For demo purposes, we'll just return a mock URL

  return {
    success: true,
    url: `https://example.com/checkout?plan=${plan}&user=${userId}&return=${returnUrl}`,
  };
}

export async function cancelSubscription() {
  const userId = (await cookies()).get("auth")?.value;

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await sql`
      UPDATE subscriptions 
      SET status = 'canceled'
      WHERE user_id = ${userId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
}

export async function updateSubscription(plan: "starter" | "pro" | "business") {
  const userId = (await cookies()).get("auth")?.value;

  if (!userId) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await sql`
      UPDATE subscriptions 
      SET plan = ${plan}
      WHERE user_id = ${userId}
    `;

    return { success: true };
  } catch (error) {
    console.error("Update subscription error:", error);
    return { success: false, error: "Failed to update subscription" };
  }
}
