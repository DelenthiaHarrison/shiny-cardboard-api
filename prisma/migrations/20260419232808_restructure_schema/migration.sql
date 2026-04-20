/*
  Warnings:

  - You are about to drop the column `cardId` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Collection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[setCode]` on the table `Set` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Collection` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `setCode` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('Mint', 'NearMint', 'LightlyPlayed', 'ModeratelyPlayed', 'HeavilyPlayed');

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_cardId_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "cardId",
DROP COLUMN "condition",
DROP COLUMN "quantity",
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "setCode" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionCard" (
    "id" SERIAL NOT NULL,
    "collectionId" INTEGER NOT NULL,
    "cardId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "condition" "Condition" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectionCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Set_setCode_key" ON "Set"("setCode");

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionCard" ADD CONSTRAINT "CollectionCard_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionCard" ADD CONSTRAINT "CollectionCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
