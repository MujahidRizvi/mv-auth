import { QueryTypes } from 'sequelize';
import sequelize from '../config/database';
import Logger from '../config/logger';
import fs from 'fs';
import helperFunctions from '../utils/helper';
import { RAW_QUERY_FILE } from '../utils/constants';

/*
 *create provider account method , it will create a new user account
 */
const createProviderAccount = async (providerAccount: any) => {
  Logger.info('ProviderAccountRepo:createProviderAccount(): - start');
  try {
    //call the save method to save the user account
    const result = await providerAccount.save();

    Logger.info('ProviderAccountRepo:createProviderAccount(): - end');

    return result;
  } catch (e) {
    Logger.error(`ProviderAccountRepo:createProviderAccount(): ${e} `);
    throw e;
  }
};

const getUserByProviderTypeAndKey = async (providerType: string, providerKey: string) => {
  Logger.info('ProviderAccountRepo:getUserByProviderTypeAndKey(): - start');

  //load raw queries from json file

  const queries = JSON.parse(fs.readFileSync(RAW_QUERY_FILE).toString());

  //load the query for this function
  let query = queries.userByProviderTypeAndKey;

  // replace parameters
  query = helperFunctions.replaceAll(query, '${providerType}', providerType);
  query = helperFunctions.replaceAll(query, '${providerKey}', providerKey);

  // passing the model type to return the result as the instance of the model
  const result = await sequelize.query(query, { type: QueryTypes.SELECT });

  Logger.info('ProviderAccountRepo:getUserByProviderTypeAndKey(): - end');

  return result[0];
};
export default {
  createProviderAccount,
  getUserByProviderTypeAndKey,
};
