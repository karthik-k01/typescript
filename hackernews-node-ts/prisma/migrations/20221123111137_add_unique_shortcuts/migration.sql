/*
  Warnings:

  - A unique constraint covering the columns `[shortcut]` on the table `Link` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Link_shortcut_key" ON "Link"("shortcut");
