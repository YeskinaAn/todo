/*
  Warnings:

  - You are about to drop the `Label` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Label_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Label";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LabelTodo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,
    CONSTRAINT "LabelTodo_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LabelTodo" ("id", "labelId", "todoId") SELECT "id", "labelId", "todoId" FROM "LabelTodo";
DROP TABLE "LabelTodo";
ALTER TABLE "new_LabelTodo" RENAME TO "LabelTodo";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
