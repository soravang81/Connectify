import { signOut } from "next-auth/react";
import { Button } from "@/src/components/ui/button";
import * as crypto from 'crypto';
import dotenv from "dotenv"
dotenv.config();

export const getTimeDifference = (createdAt: Date | string): string => {
    const createdAtDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

    const timeDifference = Date.now() - createdAtDate.getTime();

    const minutes = Math.floor(timeDifference / (1000 * 60));

    if (minutes < 1) {
      return 'now';
    }
    else if (minutes < 5) {
      return 'few mins ago';
    }
    else if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }
    else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)} hr${Math.floor(minutes / 60) > 1 ? 's' : ''} ago`;
    }
    else {
      return `${Math.floor(minutes / 1440)}d${Math.floor(minutes / 1440) > 1 ? 's' : ''} ago`;
    }
  };
export const LogOut = () => {
  return(
    <Button variant={"ghost"} size={"lg"} onClick={async()=>await signOut()} className="text-xl w-80">Logout</Button>
  )
}

export const encrypt = (str: string): string => {
  const key = process.env.ENCRYPTION_KEY;
  if (key) {
      // Pad the input string to meet the block size requirement
      const paddedStr = padString(str);

      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
      let encrypted = cipher.update(paddedStr);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return iv.toString('hex') + ':' + encrypted.toString('hex');
  } else {
      return str;
  }
};

export const decrypt = (encryptedStr: string): string => {
  const key = process.env.ENCRYPTION_KEY;
  if (key) {
      const textParts = encryptedStr.split(':');
      const iv = Buffer.from(textParts.shift() as string, 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString().trim(); // Trim any extra padding
  } else {
      return encryptedStr;
  }
};

// Function to pad the input string to meet the block size requirement
const padString = (str: string): string => {
  const blockSize = 16; // Block size in bytes
  const paddingLength = blockSize - (str.length % blockSize);
  const paddingChar = String.fromCharCode(paddingLength);
  return str + paddingChar.repeat(paddingLength);
};