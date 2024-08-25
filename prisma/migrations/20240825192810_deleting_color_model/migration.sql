/*
  Warnings:

  - You are about to drop the `ColorTheme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `colorThemeId` on the `Restaurant` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ColorTheme";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL DEFAULT 'Nome do Seu Restaurante',
    "address" TEXT NOT NULL DEFAULT 'Endereço do seu restaurante',
    "contactNumber" TEXT NOT NULL DEFAULT '11999999999',
    "instagramProfileName" TEXT NOT NULL DEFAULT 'Indefinido',
    "doDelivery" BOOLEAN NOT NULL DEFAULT true,
    "deliveryFee" TEXT NOT NULL DEFAULT '5.00',
    "deliveryTimeMinutes" TEXT NOT NULL DEFAULT '30',
    "avatarUrl" TEXT NOT NULL DEFAULT 'https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg',
    "coverUrl" TEXT NOT NULL DEFAULT 'https://utfs.io/f/c63b9ac8-ad79-48f0-a8b3-2c9cc5d4fd66-vyr1ud.png',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "colorThemeCode" TEXT NOT NULL DEFAULT '#b91c1c',
    CONSTRAINT "Restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Restaurant" ("address", "avatarUrl", "contactNumber", "coverUrl", "createdAt", "deliveryFee", "deliveryTimeMinutes", "doDelivery", "id", "instagramProfileName", "name", "updatedAt", "userId") SELECT "address", "avatarUrl", "contactNumber", "coverUrl", "createdAt", "deliveryFee", "deliveryTimeMinutes", "doDelivery", "id", "instagramProfileName", "name", "updatedAt", "userId" FROM "Restaurant";
DROP TABLE "Restaurant";
ALTER TABLE "new_Restaurant" RENAME TO "Restaurant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
