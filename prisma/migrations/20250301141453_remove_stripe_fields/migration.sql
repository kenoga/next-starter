-- Remove Stripe-related fields
ALTER TABLE "User" DROP COLUMN IF EXISTS "isActive";
ALTER TABLE "User" DROP COLUMN IF EXISTS "stripeCustomerId";

-- Drop the index if it exists
DROP INDEX IF EXISTS "User_stripeCustomerId_key";
