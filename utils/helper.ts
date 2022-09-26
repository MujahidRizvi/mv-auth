import * as crypto from 'crypto';
import jwt from 'jsonwebtoken';
import util from 'util';
import fs from 'fs';

const unlinkFile = util.promisify(fs.unlink);

const algorithm = 'aes-256-ctr';
const secretKey = process.env.CRYPT_KEY;
const iv = Buffer.alloc(16, 0);

const generateString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const encrypt = (text) => {
  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  // encrypt the message
  // input encoding
  // output encoding
  let encryptedData = cipher.update(text, 'utf-8', 'hex');

  encryptedData += cipher.final('hex');

  return encryptedData;
};

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);

  let decryptedData = decipher.update(hash, 'hex', 'utf-8');

  decryptedData += decipher.final('utf8');

  return decryptedData;
};

const createJWT = (user: any) => {
  return jwt.sign(
    {
      userId: user.userId,
    },
    process.env.JWT_TOKEN_KEY,
    { expiresIn: process.env.JWT_TOKEN_EXPIRY },
  );
};

const replaceAll = (str: string, find: any, replace: any) => {
  const escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
  return str.replace(new RegExp(escapedFind, 'g'), replace);
};

const removeAllTempAttachmentFile = async (files) => {
  if (files?.image) {
    files.image.forEach(async (val) => {
      await unlinkFile(val.path);
    });
  }
};

export default {
  encrypt,
  decrypt,
  removeAllTempAttachmentFile,
  createJWT,
  generateString,
  replaceAll,
};
