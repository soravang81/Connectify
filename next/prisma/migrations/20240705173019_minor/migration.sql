/*
  Warnings:

  - Made the column `pfp` on table `Group` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "pfp" SET NOT NULL,
ALTER COLUMN "pfp" SET DEFAULT 'https://firebasestorage.googleapis.com/v0/b/chatapp-4deee.appspot.com/o/ProfilePics%2Fdefault-group.png?alt=media&token=58a2f3df-90c6-4ec8-8552-fa1b41cc77e8';
