import { neon } from "@neondatabase/serverless";

// Create a SQL client with the connection string
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

if (!dbUrl) {
  console.error(
    "No database connection string was provided. Please set DATABASE_URL or POSTGRES_URL environment variable."
  );
}

// Create a singleton SQL client
let sqlClient: ReturnType<typeof neon>;

export function getSqlClient() {
  if (!sqlClient) {
    sqlClient = neon(dbUrl);
  }
  return sqlClient;
}

// Export the sql function directly - we'll use tagged template literals
export const sql = getSqlClient();

// Helper function to safely convert SQL results to an array
export function safeArray(result: any): any[] {
  // If result is undefined or null, return empty array
  if (result === undefined || result === null) {
    return [];
  }

  // If it's already an array, return it
  if (Array.isArray(result)) {
    return result;
  }

  // Check if it's an object with rows property (common in some SQL libraries)
  if (result && typeof result === "object" && Array.isArray(result.rows)) {
    return result.rows;
  }

  // If it's an object but not an array, wrap it in an array
  if (result && typeof result === "object") {
    return [result];
  }

  // Default to empty array
  return [];
}

// Function to execute SQL queries
export async function query(sql: string, params: any[] = []) {
  try {
    const client = getSqlClient();
    const result = await client.query(sql, params);
    return result;
  } catch (error: any) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Export the sql function directly - we'll use tagged template literals
export default sql;
