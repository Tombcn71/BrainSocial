import sql, { safeArray } from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    // Execute the query
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;

    // INCORRECT WAY - This causes the TypeScript error:
    // const user = result[0] // Error: Property '0' does not exist on type...

    // CORRECT WAY - Use the safeArray helper:
    const users = safeArray(result);

    if (users.length === 0) {
      return { success: false, error: "User not found" };
    }

    // Now we can safely access the first element
    const user = users[0];

    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Failed to fetch user" };
  }
}
