/*
  Warnings:

  - You are about to drop the column `name` on the `Tags` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[title]` on the table `Tags`. If there are existing duplicate values, the migration will fail.
  - Added the required column `title` to the `Tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Tags.name_unique";

-- AlterTable
ALTER TABLE "Tags" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tags.title_unique" ON "Tags"("title");
