import UserAccount from '..//models/user-account.model';
import Logger from '../config/logger';

/*
 *get user account by user id
 */

const getUserAccountById = async (id: number) => {
  Logger.info('UserAccountRepo:getUserAccountById(): - start');

  const result = await UserAccount.findOne({ where: { id } });

  Logger.info('UserAccountRepo:getUserAccountById(): - end');

  return result;
};

/*
 *create user account method , it will create a new user account
 */
const createUserAccount = async (userAccount: any) => {
  try {
    Logger.info('UserAccountRepo:createUserAccount(): - start');

    //call the save method to save the user account
    const result = await userAccount.save();

    Logger.info('UserAccountRepo:createUserAccount(): - end');

    return result;
  } catch (e) {
    Logger.error(`UserAccountRepo:createUserAccount(): ${e} `);
    throw e;
  }
};


/*
 *update user ipfs hash , it will update the user ipfs hash
 */
 const updateUserIpfsHash = async (id: number, ipfsHash: string) => {
  try {
    Logger.info('UserAccountRepo:updateUserIpfsHash(): - start');

    // call the method to update the ipfs Hash
    const result = await UserAccount.update(
      { ipfsHash },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      },
    );
    Logger.info('UserAccountRepo:updateUserIpfsHash(): - end');

    // return the object
    return result[1].dataValues;
  } catch (e) {
    Logger.error(`UserAccountRepo:updateUserIpfsHash(): ${e} `);
    throw e;
  }
};

/*
 *update user screen name , it will update the user screen name
 */
const updateUserScreenName = async (id: number, userScreenName: string) => {
  try {
    Logger.info('UserAccountRepo:updateUserScreenName(): - start');

    // call the method to update the screenname
    const result = await UserAccount.update(
      { userScreenName },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      },
    );
    Logger.info('UserAccountRepo:updateUserScreenName(): - end');

    // return the object
    return result[1].dataValues;
  } catch (e) {
    Logger.error(`UserAccountRepo:updateUserScreenName(): ${e} `);
    throw e;
  }
};

/*
 *update user , it will update the user
 */
const updateUser = async (id: number, user: any) => {
  try {
    Logger.info('UserAccountRepo:updateUser(): - start');

    // call the method to update the screenname
    const result = await UserAccount.update(
      {
        userScreenName: user.userScreenName,
        twitter: user.twitter,
        email: user.email,
        instagram: user.instagram,
        updatedBy: user.updatedBy,
        profileImage: user.profileImage
      },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      },
    );
    Logger.info('UserAccountRepo:updateUser(): - end');

    // return the object
    return result[1].dataValues;
  } catch (e) {
    Logger.error(`UserAccountRepo:updateUserScreenName(): ${e} `);
    throw e;
  }
};

export default {
  createUserAccount,
  updateUserIpfsHash,
  updateUserScreenName,
  getUserAccountById,
  updateUser,
};
