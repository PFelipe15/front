/*
  Warnings:

  - You are about to drop the column `perfilId` on the `User` table. All the data in the column will be lost.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PerfilType" ADD VALUE 'ADMIN';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "perfilId",
ADD COLUMN     "type" "PerfilType" NOT NULL;
