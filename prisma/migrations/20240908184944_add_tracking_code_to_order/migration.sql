/*
  Warnings:

  - Added the required column `trackingCode` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "clientName" TEXT,
    "orderType" TEXT NOT NULL,
    "totalPrice" TEXT NOT NULL,
    "table" TEXT,
    "trackingCode" TEXT NOT NULL,
    "clientContact" TEXT,
    "clientAddress" TEXT
);
INSERT INTO "new_Order" ("clientAddress", "clientContact", "clientName", "createdAt", "id", "identifier", "note", "orderType", "status", "table", "totalPrice", "updatedAt") SELECT "clientAddress", "clientContact", "clientName", "createdAt", "id", "identifier", "note", "orderType", "status", "table", "totalPrice", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
