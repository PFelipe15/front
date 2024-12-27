/*
  Warnings:

  - You are about to drop the column `projetoId` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `unidade` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `progresso` on the `Service` table. All the data in the column will be lost.
  - The `status` column on the `Service` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `cargo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registro` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `atualizadoEm` on the `Workspace` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Workspace` table. All the data in the column will be lost.
  - You are about to drop the column `progresso` on the `Workspace` table. All the data in the column will be lost.
  - You are about to drop the `Anotacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Update` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkspaceUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `valor` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfilId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PerfilType" AS ENUM ('ENGENHEIRO', 'GESTOR');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO', 'ATRASADO');

-- DropForeignKey
ALTER TABLE "Anotacao" DROP CONSTRAINT "Anotacao_userId_fkey";

-- DropForeignKey
ALTER TABLE "Anotacao" DROP CONSTRAINT "Anotacao_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "Update" DROP CONSTRAINT "Update_projetoId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceUser" DROP CONSTRAINT "WorkspaceUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkspaceUser" DROP CONSTRAINT "WorkspaceUser_workspaceId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "projetoId",
DROP COLUMN "status",
DROP COLUMN "unidade",
ADD COLUMN     "valor" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "workspaceId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "progresso",
DROP COLUMN "status",
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'EM_ANDAMENTO',
ALTER COLUMN "ultimaAtualizacao" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cargo",
DROP COLUMN "createdAt",
DROP COLUMN "nome",
DROP COLUMN "registro",
DROP COLUMN "updatedAt",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "perfilId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" DROP COLUMN "atualizadoEm",
DROP COLUMN "criadoEm",
DROP COLUMN "progresso",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "linkGoogleEarth" TEXT,
ADD COLUMN     "linkGoogleMaps" TEXT,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'EM_ANDAMENTO',
ALTER COLUMN "gasto" SET DEFAULT 0,
ALTER COLUMN "descricao" DROP NOT NULL,
ALTER COLUMN "riscos" SET DEFAULT 0,
ALTER COLUMN "riscos" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "Anotacao";

-- DropTable
DROP TABLE "Update";

-- DropTable
DROP TABLE "WorkspaceUser";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Atualizacao" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" INTEGER NOT NULL,

    CONSTRAINT "Atualizacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atualizacao" ADD CONSTRAINT "Atualizacao_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
