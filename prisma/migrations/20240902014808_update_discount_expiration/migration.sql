/*
  Warnings:

  - You are about to alter the column `expiration` on the `Discount` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Discount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itemId" TEXT NOT NULL,
    "newPrice" TEXT NOT NULL,
    "expiration" DATETIME NOT NULL DEFAULT '9999-12-31 23:59:59.999 +00:00',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Discount_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Discount" ("createdAt", "expiration", "id", "itemId", "newPrice", "updatedAt") SELECT "createdAt", "expiration", "id", "itemId", "newPrice", "updatedAt" FROM "Discount";
DROP TABLE "Discount";
ALTER TABLE "new_Discount" RENAME TO "Discount";
CREATE UNIQUE INDEX "Discount_itemId_key" ON "Discount"("itemId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
