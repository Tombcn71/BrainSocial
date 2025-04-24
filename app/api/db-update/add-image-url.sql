-- Add image_url column to content table if it doesn't exist
DO $
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'content' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE content ADD COLUMN image_url TEXT;
    END IF;
END $;
