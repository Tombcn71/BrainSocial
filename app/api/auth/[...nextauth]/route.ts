import sql, { safeArray } from "@/lib/db";

// Inside a callback or handler function
async function findUserByEmail(email: string) {
  const result =
    await sql`SELECT id, name, email FROM users WHERE email = ${email}`;

  // Use safeArray to ensure we have an array
  const users = safeArray(result);

  // Now we can safely check if we found a user and access the first element
  return users.length > 0 ? users[0] : null;
}
