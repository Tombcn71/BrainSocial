import { query } from "@/lib/db"

export default async function TestDbPage() {
  let dbStatus = "Unknown"
  let error = null

  try {
    // Simple query to test database connection
    const result = await query("SELECT 1 as test")
    dbStatus = result && result.rows && result.rows[0]?.test === 1 ? "Connected" : "Failed"
  } catch (err: any) {
    dbStatus = "Error"
    error = err.message || String(err)
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <div className="p-4 border rounded-md">
        <p>
          Status:{" "}
          <span className={dbStatus === "Connected" ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
            {dbStatus}
          </span>
        </p>
        {error && (
          <div className="mt-4">
            <p className="text-red-500 font-bold">Error:</p>
            <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">{error}</pre>
          </div>
        )}
        <p className="mt-4 text-sm text-gray-500">
          If you see "Connected", your database connection is working properly. If not, check your DATABASE_URL
          environment variable.
        </p>
      </div>
    </div>
  )
}
