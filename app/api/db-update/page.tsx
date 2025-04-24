import sql from "@/lib/db";

export default async function AddImageUrlPage() {
  let result = "Wachten op database update...";
  let success = false;
  let error = null;

  try {
    // Add image_url column to content table if it doesn't exist
    await sql`
      DO $
      BEGIN
          IF NOT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_name = 'content' AND column_name = 'image_url'
          ) THEN
              ALTER TABLE content ADD COLUMN image_url TEXT;
              RAISE NOTICE 'Added image_url column to content table';
          ELSE
              RAISE NOTICE 'image_url column already exists in content table';
          END IF;
      END $;
    `;

    result =
      "Database succesvol bijgewerkt! De image_url kolom is toegevoegd aan de content tabel.";
    success = true;
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    result = "Fout bij het bijwerken van de database: " + error;
  }

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">
          Database Update - Afbeeldingen
        </h1>

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Succes!</p>
            <p>{result}</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Fout</p>
            <p>{result}</p>
          </div>
        ) : (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <p>{result}</p>
          </div>
        )}

        <div className="mt-4">
          <a
            href="/dashboard/content"
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Ga naar Content
          </a>
        </div>
      </div>
    </div>
  );
}
