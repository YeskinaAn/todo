/*
  Warnings:

  - You are about to drop the column `labelId` on the `LabelTodo` table. All the data in the column will be lost.
  - Added the required column `title` to the `LabelTodo` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LabelTodo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LabelTodo_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LabelTodo" ("id", "todoId") SELECT "id", "todoId" FROM "LabelTodo";
DROP TABLE "LabelTodo";
ALTER TABLE "new_LabelTodo" RENAME TO "LabelTodo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
