-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL DEFAULT 'https://utfs.io/f/1af4aa51-b003-476c-9c1d-d5d9b491058e-801omg.jpg',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isVegan" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ItemCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("categoryId", "createdAt", "description", "id", "imageUrl", "isAvailable", "isVegan", "name", "price", "updatedAt") SELECT "categoryId", "createdAt", "description", "id", "imageUrl", "isAvailable", "isVegan", "name", "price", "updatedAt" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE TABLE "new_OpeningHours" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dayOfWeek" TEXT NOT NULL DEFAULT 'Dia da Semana',
    "openTime" TEXT NOT NULL DEFAULT '08:00',
    "closeTime" TEXT NOT NULL DEFAULT '18:00',
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "OpeningHours_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OpeningHours" ("closeTime", "dayOfWeek", "id", "isOpen", "openTime", "restaurantId") SELECT "closeTime", "dayOfWeek", "id", "isOpen", "openTime", "restaurantId" FROM "OpeningHours";
DROP TABLE "OpeningHours";
ALTER TABLE "new_OpeningHours" RENAME TO "OpeningHours";
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
    "colorThemeId" TEXT NOT NULL DEFAULT '1',
    CONSTRAINT "Restaurant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Restaurant_colorThemeId_fkey" FOREIGN KEY ("colorThemeId") REFERENCES "ColorTheme" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Restaurant" ("address", "avatarUrl", "colorThemeId", "contactNumber", "coverUrl", "createdAt", "deliveryFee", "deliveryTimeMinutes", "doDelivery", "id", "instagramProfileName", "name", "updatedAt", "userId") SELECT "address", "avatarUrl", "colorThemeId", "contactNumber", "coverUrl", "createdAt", "deliveryFee", "deliveryTimeMinutes", "doDelivery", "id", "instagramProfileName", "name", "updatedAt", "userId" FROM "Restaurant";
DROP TABLE "Restaurant";
ALTER TABLE "new_Restaurant" RENAME TO "Restaurant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
