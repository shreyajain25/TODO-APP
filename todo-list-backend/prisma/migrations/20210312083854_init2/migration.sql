/*
  Warnings:

  - You are about to drop the column `task` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Todo` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[taskName]` on the table `Todo`. If there are existing duplicate values, the migration will fail.
  - Added the required column `taskName` to the `Todo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskDate` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Todo.task_unique";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "task",
DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "taskName" TEXT NOT NULL,
ADD COLUMN     "taskDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "taskTime" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "token";

-- CreateTable
CREATE TABLE "Tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "taskId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tags.name_unique" ON "Tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Todo.taskName_unique" ON "Todo"("taskName");

-- AddForeignKey
ALTER TABLE "Tags" ADD FOREIGN KEY ("taskId") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
