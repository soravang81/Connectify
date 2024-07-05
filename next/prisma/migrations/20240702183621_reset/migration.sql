/*
  Warnings:

  - You are about to drop the column `friends` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `pfp` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the `UserRequests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRequests" DROP CONSTRAINT "UserRequests_requestId_fkey";

-- DropForeignKey
ALTER TABLE "UserRequests" DROP CONSTRAINT "UserRequests_userId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "friends",
DROP COLUMN "pfp",
ADD COLUMN     "lastSeen" TIMESTAMP(3);

-- DropTable
DROP TABLE "UserRequests";

-- CreateTable
CREATE TABLE "Friends" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,
    "unreadMessageCount" INTEGER,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePics" (
    "id" SERIAL NOT NULL,
    "uid" INTEGER NOT NULL,
    "path" TEXT NOT NULL DEFAULT 'ProfilePics/default-pic.jpg',
    "url" TEXT NOT NULL DEFAULT 'https://firebasestorage.googleapis.com/v0/b/chatapp-4deee.appspot.com/o/ProfilePics%2Fdefault-pic.jpg?alt=media&token=53c51d35-079f-4e2e-addc-c6b40cfe8630',

    CONSTRAINT "ProfilePics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pfp" TEXT,
    "members" INTEGER[],
    "admins" INTEGER[],

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Groupchat" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "members" INTEGER[],
    "message" INTEGER NOT NULL,
    "seenBy" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Groupchat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfilePics_uid_key" ON "ProfilePics"("uid");

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePics" ADD CONSTRAINT "ProfilePics_uid_fkey" FOREIGN KEY ("uid") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Groupchat" ADD CONSTRAINT "Groupchat_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
