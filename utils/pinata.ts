import FormData from 'form-data';
import fs from 'fs';
import { post } from './httpclient';
import Logger from '../config/logger';

// uploadFile
const uploadFileToIPFS = async (file) => {
  let data = new FormData();
  data.append('file', fs.createReadStream(file.path));

  const pinataFileOptions = {
    headers: {
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_API_SECRET,
      'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
    },
  };

  const pinToPinata = await post(process.env.PINATA_PIN_FILE_URL, data, pinataFileOptions);

  return pinToPinata.IpfsHash;
};

export default {
  uploadFileToIPFS,
};
