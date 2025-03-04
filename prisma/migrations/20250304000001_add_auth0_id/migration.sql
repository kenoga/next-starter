-- AlterTable
ALTER TABLE "User" ADD COLUMN "auth0Id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_auth0Id_key" ON "User"("auth0Id");