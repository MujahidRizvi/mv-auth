import httpStatusCodes from 'http-status-codes';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { ApiError } from '../utils/ApiError';
import userAccountRepo from '../repos/user-account.repo';
import providerAccountRepo from '../repos/provider-account.repo';
import UserAccount from '../models/user-account.model';
import ProviderAccount from '../models/provider-account.model';
import locale from '../utils/locale';
import Logger from '../config/logger';
import { Provider } from '../utils/enums';
import { DEFAULT_ADDRESS, USER_STATE } from '../utils/constants';
import helperFunctions from '../utils/helper';
import pinataFunction from '../utils/pinata';
import { post, get } from '../utils/httpclient';
import util from 'util';
import fs from 'fs';
import { redisClient } from '../app';

const unlinkFile = util.promisify(fs.unlink);

/**
 * updateUserScreenName is used to update the user screen name which will appear on UI.
 * @param  userId
 * @param userScreenName
 * @returns will return the updated screenName
 */

const updateUserScreenName = async (userId: number, userScreenName: string) => {
  Logger.info('UserService:updateUserScreenName(): - start');

  // check if user exists
  const userAccount = await userAccountRepo.getUserAccountById(userId);

  // if user account not found then throw error
  if (!userAccount) {
    throw new ApiError(httpStatusCodes.BAD_REQUEST, locale.USER_NOT_FOUND({ id: userId }), httpStatusCodes.BAD_REQUEST);
  }

  const updatedUserScreenName = await userAccountRepo.updateUserScreenName(userId, userScreenName);

  Logger.info('UserService:updateUserScreenName(): - end');

  return updatedUserScreenName;
};

const updateUser = async (userId: number, updatedUserValues: any, files: any = {}) => {
  Logger.info('UserService:updateUser(): - start');

  // check if user exists
  const userAccount = await userAccountRepo.getUserAccountById(userId);
  if (userAccount) {
    try {
      const user = updatedUserValues?.user;
      const pinataOptions = {
        headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_API_SECRET,
          'Content-Type': 'application/json',
        },
        maxContentLength: 10000000000,
        maxBodyLength: 100000000000,
      };

      const parsedUser = JSON.parse(user);
      if (Object.keys(files).length > 0) {
        //upload Image function
        const ipfsImageHash = await uploadImage(files);

        //Finding profileImage index from attributes array to replace it with ipfsImagePath
        const index = parsedUser?.attributes.findIndex((obj) => obj.trait_type == 'profile_image');

        if (index > -1) {
          parsedUser.attributes[index].value = ipfsImageHash;
        }
      }

      //Storing user data on IPFS
      const pinToPinata = await post(process.env.PINATA_PIN_JSON_URL, JSON.stringify(parsedUser), pinataOptions);
      await userAccountRepo.updateUserIpfsHash(userId, pinToPinata?.IpfsHash);

      Logger.info('UserService:updateUser(): - end');

      return parsedUser;
    } catch (e) {
      //delete the file from local storage
      Logger.info('UserService:updateUser(): - end');
      // throw the error to api
      throw new ApiError(httpStatusCodes.BAD_REQUEST, e, httpStatusCodes.BAD_REQUEST);
    }
  } else {
    throw new ApiError(httpStatusCodes.BAD_REQUEST, locale.USER_NOT_FOUND({ id: userId }), httpStatusCodes.BAD_REQUEST);
  }
};

const uploadImage = async (files: any = {}) => {
  Logger.info('UserService:uploadImage(): - start');

  try {
    let ipfsImageHash;
    // if image is present then update image name against user id
    if (files.image) {
      //upload files to pinata bucket
      const logoCID = await pinataFunction.uploadFileToIPFS(files.image[0]);

      if (logoCID) {
        ipfsImageHash = process.env.PINATA_GET_URL.concat(logoCID);
      }

      // delete the file from local storage
      await unlinkFile(files.image[0].path);
    }

    Logger.info('UserService:uploadImage(): - end');

    return ipfsImageHash;
  } catch (e) {
    //delete the file from local storage
    if (files.image) await unlinkFile(files.image[0].path);
    Logger.info('UserService:uploadImage(): - end');
    // throw the error to api
    throw new ApiError(httpStatusCodes.BAD_REQUEST, e, httpStatusCodes.BAD_REQUEST);
  }
};

/**
 * getUserById is used to get the individual user data.
 * @param  userId
 * @returns will return the user data
 */
const getUserBySessionToken = async (userId: number) => {
  Logger.info('UserService:getUserBySessionToken(): - start');

  // check if user exists
  const userAccount = await userAccountRepo.getUserAccountById(userId);
  let userFetchedFromIPFS;

  //getting user data from ipfs
  if (userAccount.ipfsHash) {
    userFetchedFromIPFS = await get(process.env.PINATA_GET_URL.concat(userAccount.ipfsHash));
  }

  // if user account not found then throw error
  if (!userAccount) {
    throw new ApiError(httpStatusCodes.BAD_REQUEST, locale.USER_NOT_FOUND({ id: userId }), httpStatusCodes.BAD_REQUEST);
  }

  Logger.info('UserService:getUserBySessionToken(): - end');

  return userFetchedFromIPFS;
};

/**
 * getUserById is used to get the individual user data.
 * @param  userId
 * @returns will return the user data
 */
const generateJwt = async (userId: number) => {
  Logger.info('UserService:generateJwt(): - start');
  // check if user exists
  let userAccount = await userAccountRepo.getUserAccountById(userId);

  // if user account not found then throw error
  if (!userAccount) {
    throw new ApiError(httpStatusCodes.BAD_REQUEST, locale.USER_NOT_FOUND({ id: userId }), httpStatusCodes.BAD_REQUEST);
  }
  userAccount = { ...userAccount.dataValues, userId: userAccount.id };
  //passing userId as object argument
  const jwtToken = helperFunctions.createJWT(userAccount);

  Logger.info('UserService:generateJwt(): - end');

  return jwtToken;
};

/**
 * signUp is a generic function which will be called all providers. it will branch out to the relevant implementation.
 * @param  providerType
 * @param providerKey
 * @returns newly created user object
 */
const signUp = async (providerType: string, providerKey: string, userScreenName: string) => {
  Logger.info('UserService:signup(): - start');
  let result: any;

  //check providerType and act accordingly.
  switch (providerType) {
    case Provider.Wallet:
      //call wallet mechisim to process and return the result
      result = signUpWithWallet(providerType, providerKey, userScreenName);
      break;
    case Provider.Google:
      // TBD
      Logger.error('UserService: Google implementation not implemented');
      throw new ApiError(httpStatusCodes.BAD_REQUEST, locale.NOT_IMPLEMENTED, httpStatusCodes.BAD_REQUEST);
    default: {
      Logger.error('UserService: Invalid provider type');
      throw new ApiError(httpStatusCodes.BAD_REQUEST, locale.INVALID_PROVIDER_TYPE, httpStatusCodes.BAD_REQUEST);
    }
  }

  Logger.info('UserService:signup(): - end');

  return result;
};

/**
 * login is a generic function which will be called all providers. it will branch out to the relevant implementation.
 * @param  providerType
 * @param  providerKey
 * @param  signature
 * @returns newly created user object
 */
const login = async (providerType: string, providerKey: string, signature: string) => {
  Logger.info('UserService:login(): - start');

  let result: any;

  //check providerType and act accordingly.
  switch (providerType) {
    case Provider.Wallet:
      //call wallet mechisim to process and return the result
      result = loginWithWallet(providerType, providerKey, signature);
      break;
    case Provider.Google:
      // TBD
      Logger.error('UserService: Google implementation not implemented.');
      throw new ApiError(httpStatusCodes.BAD_REQUEST, locale.NOT_IMPLEMENTED, httpStatusCodes.BAD_REQUEST);
    default: {
      Logger.error('UserService: Invalid provider type.');
      throw new ApiError(httpStatusCodes.BAD_REQUEST, locale.INVALID_PROVIDER_TYPE, httpStatusCodes.BAD_REQUEST);
    }
  }

  Logger.info('UserService:login(): - end');

  return result;
};

/**
 * signUpWithWallet function will create a new user in the db with the provider key being
 * the Ethereum address passed in (if a user with that address doesn't already exist).
 * Will also create a new nonce (random number) to be saved with the user in the provider_accounts
 * table which will be used as the wallet signature message on the UI.
 * It's important to create the User in the db with a random nonce *before* they sign a message
 * in their wallet, so we can verify the signature is valid in the login function.
 * @param  providerType
 * @param providerKey
 * @returns newly created user object
 */
const signUpWithWallet = async (providerType: string, providerKey: string, userScreenName: string) => {
  Logger.info('UserAccountService:signUpWithWallet(): - start');

  //make magic number for nonce
  const nonce = Math.floor(Math.random() * 1000000);
  const redisKeyExpiry = parseInt(process.env.REDIS_KEY_EXPIRY, 10) || 600;
  // encrypt the providerKey as we are storing Key as encrypted
  const encproviderKey = helperFunctions.encrypt(Buffer.from(providerKey, 'utf8'));

  // get the user information based on the providerType and providerKey
  let user = await providerAccountRepo.getUserByProviderTypeAndKey(providerType, encproviderKey);

  // if no user means the user is coming for the first time in our system so need to create a new user
  // and pass it back
  if (!user) {
    Logger.error(`UserAccountService:signUpWithWallet():no user found. creating new user.`);

    // first create user in userAccount
    const newUser = new UserAccount();

    // set userScreenName as empty as wallet does not return user name
    //newUser.userScreenName = userScreenName;

    const pinataOptions = {
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET,
        'Content-Type': 'application/json',
      },
      maxContentLength: 10000000000,
      maxBodyLength: 100000000000,
    };

    // //create the user in user account table which will generate the user id
    const dbUser = await userAccountRepo.createUserAccount(newUser);

    const valuesToReplace = {
      user_id: dbUser.id,
      user_wallet_address: providerKey,
    };

    Object.keys(valuesToReplace).map((item) => {
      //Finding index from attributes array to replace it with respective Values
      const index = USER_STATE?.attributes.findIndex((obj) => obj.trait_type === item);

      if (index > -1) {
        USER_STATE.attributes[index].value = valuesToReplace[item];
      }
    });

    //Storing user data on IPFS
    const pinToPinata = await post(process.env.PINATA_PIN_JSON_URL, JSON.stringify(USER_STATE), pinataOptions);

    const userWithIpfsHash = await userAccountRepo.updateUserIpfsHash(dbUser.id, pinToPinata?.IpfsHash);

    // get the user id from the newly created user and pass it to the provider_account
    const newProvider = new ProviderAccount();
    //setting the fields
    newProvider.userAccountId = userWithIpfsHash.id;
    newProvider.providerType = providerType;
    newProvider.providerKey = encproviderKey.toString();
    newProvider.isActive = true;
    newProvider.isManual = true;

    //call the save method to save the information
    await providerAccountRepo.createProviderAccount(newProvider);

    //call the method again to get the latest from database
    user = await providerAccountRepo.getUserByProviderTypeAndKey(providerType, encproviderKey);
  }

  Logger.info('UserAccountService:signUpWithWallet(): - end');

  // we don't need to return the provider key so removing it from user
  delete user.providerKey;

  // set the key
  await redisClient.set(providerKey, nonce);
  await redisClient.expire(providerKey, redisKeyExpiry);

  // return the user
  return {
    ...user,
    nonce,
  };
};

/**
 * Login will get the User (created in the signup function above) from the db associated with an address,
 * create a message with the random nonce saved with that User object, verify the given signature to see
 * if the signature's message contains the correct nonce, and verify the signature's
 * Ethereum address matches the user's saved address.
 * If the signature and address are valid, a new JWT token is created and passed to the frontend.   *
 * @param providerType
 * @param providerKey
 * @param signature
 * @returns User object with a newly created JWT token
 */
const loginWithWallet = async (providerType: string, providerKey: string, signature: string) => {
  Logger.info('UserService:loginWithWallet(): - start');

  //check if signature is passed in case of wallet
  if (!signature) {
    //signature didn't match so spitting out the error
    Logger.error('UserService:loginWithWallet():singnature missing.');
    throw new ApiError(httpStatusCodes.UNAUTHORIZED, locale.SIGNATURE_REQUIRED, httpStatusCodes.UNAUTHORIZED);
  }

  //get nonce from redis cache
  const nonce = await redisClient.get(providerKey);

  // if nonce not exits means the service has already consumed it
  if (!nonce) {
    //nonce not present didn't match so spitting out the error
    Logger.error('UserService:loginWithWallet():signature verification failed.');
    throw new ApiError(
      httpStatusCodes.UNAUTHORIZED,
      locale.SIGNATURE_VERIFICATION_FAILED,
      httpStatusCodes.UNAUTHORIZED,
    );
  }

  const encProviderKey = helperFunctions.encrypt(Buffer.from(providerKey, 'utf8'));

  // get the user information based on the providerType and providerKey
  let user = await providerAccountRepo.getUserByProviderTypeAndKey(providerType, encProviderKey);

  if (user) {
    const msg = `${process.env.NONCE_KEY} ${nonce}`;

    // We now are in possession of msg, publicAddress and signature. We
    // will use the helper method from eth-sig-util to extract the address from the signature
    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));

    const ethAddress = recoverPersonalSignature({
      data: msgBufferHex,
      signature: signature,
    });

    // decrypt the key conatining the ethereum address so that it can be compared with the incoming etereum address
    const decProviderKey = helperFunctions.decrypt(user.providerKey);

    // Check if address matches
    if (ethAddress.toLowerCase() === decProviderKey.toLowerCase()) {
      // create jwt token for user
      const token = helperFunctions.createJWT(user);

      // we don't need to return the provider key
      delete user.providerKey;

      // delete from cache
      await redisClient.del(providerKey);

      let userFetchedFromIPFS;

      //getting user data from ipfs
      if (user.ipfsHash) {
        userFetchedFromIPFS = await get(process.env.PINATA_GET_URL.concat(user.ipfsHash));
      }

      // return the token embedded in user response
      return {
        ...userFetchedFromIPFS,
        token,
      };
    } else {
      //signature didn't match so spitting out the error
      Logger.error('UserService:loginWithWallet():signature verification failed.');
      throw new ApiError(
        httpStatusCodes.UNAUTHORIZED,
        locale.SIGNATURE_VERIFICATION_FAILED,
        httpStatusCodes.UNAUTHORIZED,
      );
    }
  } else {
    // no user found, means credentails are invalid. spitting out the error
    Logger.error('UserService:loginWithWallet():login credentails are not valid');
    throw new ApiError(httpStatusCodes.UNAUTHORIZED, locale.INVALID_LOGIN_CREDENTIALS, httpStatusCodes.UNAUTHORIZED);
  }
};

/**
 * createAndGetUsersWithProviderTypeandKeys function will get users  with the provider key being
 * the Ethereum address passed in as array.if a user with that address doesn't already exist then it will create a user as well.
 * Currently this service is being called internally from mv_objects of updateAssetOwner method.
 * @param providerType
 * @param providerKeys
 * @returns array of users object
 */
const createAndGetUsersWithProviderTypeandKeys = async (providerType: string, providerKeys: string[]) => {
  Logger.info('UserAccountService:GetAndCreateUsersWithProviderTypeandKeys(): - start');

  const returnUsers = [];

  //go through the passed array and get the key one by one
  for (let providerKey of providerKeys) {
    if (providerKey === DEFAULT_ADDRESS) continue; // skip if default address , we won't be creating a new record here

    // encrypt the providerKey as we are storing Key as encrypted
    const encproviderKey = helperFunctions.encrypt(Buffer.from(providerKey, 'utf8'));

    // get the user information based on the providerType and providerKey
    let user = await providerAccountRepo.getUserByProviderTypeAndKey(providerType, encproviderKey);

    // if no user means the user is coming for the first time in our system so need to create a new user
    // and pass it back
    if (!user) {
      Logger.error(
        `UserAccountService:createAndGetUsersWithProviderTypeandKeys():no user found against ${providerKey}. creating new user.`,
      );

      // first create user in userAccount
      const newUser = new UserAccount();

      // set userScreenName as empty as wallet does not return user name
      newUser.userScreenName = '';

      //create the user in user account table which will generate the user id
      const dbUser = await userAccountRepo.createUserAccount(newUser);

      // get the user id from the newly created user and pass it to the provider_account
      const newProvider = new ProviderAccount();
      //setting the fields
      newProvider.userAccountId = dbUser.id;
      newProvider.providerType = providerType;
      newProvider.providerKey = encproviderKey.toString();
      newProvider.isActive = true;
      newProvider.isManual = false; // user created by the system automatically

      //call the save method to save the information
      await providerAccountRepo.createProviderAccount(newProvider);

      //call the method again to get the latest from database
      user = await providerAccountRepo.getUserByProviderTypeAndKey(providerType, encproviderKey);
    }

    //decrypt the key and pass it back
    user.providerKey = helperFunctions.decrypt(user.providerKey);

    returnUsers.push(user);
  }

  Logger.info('UserAccountService:createAndGetUsersWithProviderTypeandKeys(): - end');

  // return the users array
  return returnUsers;
};

export default {
  signUp,
  login,
  generateJwt,
  updateUserScreenName,
  createAndGetUsersWithProviderTypeandKeys,
  getUserBySessionToken,
  updateUser,
  uploadImage,
};
