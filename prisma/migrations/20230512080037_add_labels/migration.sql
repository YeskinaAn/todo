-- AlterTable
ALTER TABLE "Todo" ADD COLUMN "dueDate" DATETIME;
ALTER TABLE "Todo" ADD COLUMN "priority" INTEGER;

-- CreateTable
CREATE TABLE "Label" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LabelTodo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "todoId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,
    CONSTRAINT "LabelTodo_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LabelTodo_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "Label" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name");
