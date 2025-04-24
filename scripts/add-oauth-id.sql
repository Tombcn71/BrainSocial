-- Add oauth_id column to users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'oauth_id'
    ) THEN
        ALTER TABLE users ADD COLUMN oauth_id TEXT;
    END IF;
END $$;

-- Create index on oauth_id for faster lookups
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_indexes
        WHERE tablename = 'users' AND indexname = 'users_oauth_id_idx'
    ) THEN
        CREATE INDEX users_oauth_id_idx ON users(oauth_id);
    END IF;
END $$;
