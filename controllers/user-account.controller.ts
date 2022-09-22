import userAccountService from '../services/user-account.service';
import httpStatusCodes from 'http-status-codes';
import ApiResponse from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { resultsValidator } from '../validators/user-account.validator';
import Logger from '../config/logger';

const updateUserScreenName = async (req, res) => {
  Logger.info('UserAccountController:updateUserScreenName(): - start');
  const hasErrors = resultsValidator(req);

  if (hasErrors.length > 0) {
    throw new ApiError(
      httpStatusCodes.UNPROCESSABLE_ENTITY,
      hasErrors.toString(),
      httpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  //Call the method from the service layer
  const result = await userAccountService.updateUserScreenName(req.params.userId, req.body.userScreenName);
  const userScreenName = result.userScreenName;
  ApiResponse.result(res, { userScreenName }, httpStatusCodes.OK);

  Logger.info('UserAccountController:updateUserScreenName(): - end');
};

const updateUser = async (req, res) => {
  Logger.info('UserAccountController:updateUser(): - start');
  const hasErrors = resultsValidator(req);

  if (hasErrors.length > 0) {
    throw new ApiError(
      httpStatusCodes.UNPROCESSABLE_ENTITY,
      hasErrors.toString(),
      httpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }
  
  //Call the method from the service layer
  const result = await userAccountService.updateUser(req.params.userId, req.body , req.files);
  ApiResponse.result(res, result, httpStatusCodes.OK);

  Logger.info('UserAccountController:updateUser(): - end');
};


const uploadImage = async (req, res) => {
  Logger.info('UserAccountController:uploadImage(): - start');
  const hasErrors = resultsValidator(req);

  //Call the method from the service layer
  const result = await userAccountService.uploadImage(req.files);
  ApiResponse.result(res, result, httpStatusCodes.OK);

  Logger.info('UserAccountController:uploadImage(): - end');
};

const signUp = async (req, res) => {
  Logger.info('UserAccountController:signUp(): - start');
  const hasErrors = resultsValidator(req);

  if (hasErrors.length > 0) {
    throw new ApiError(
      httpStatusCodes.UNPROCESSABLE_ENTITY,
      hasErrors.toString(),
      httpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  //Call the method from the service layer
  const user = await userAccountService.signUp(req.body.providerType, req.body.providerKey, req.body.userScreenName);

  ApiResponse.result(res, user, httpStatusCodes.OK);

  Logger.info('UserController:signUp(): - end');
};

const login = async (req, res) => {
  Logger.info('UserAccountController:login(): - start');
  const hasErrors = resultsValidator(req);

  if (hasErrors.length > 0) {
    throw new ApiError(
      httpStatusCodes.UNPROCESSABLE_ENTITY,
      hasErrors.toString(),
      httpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  //Call the method from the service layer
  const user = await userAccountService.login(req.body.providerType, req.body.providerKey, req.body.signature);
  //setting cookie header
  res.cookie('token', user.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: parseInt(process.env.COOKIE_EXPIRY) * 1000, //cookie will expire after one year
  });

  ApiResponse.result(res, user, httpStatusCodes.OK);

  Logger.info('UserController:login(): - end');
};

const getUserBySessionToken = async (req, res) => {
  Logger.info('UserAccountController:getUserBySessionToken(): - start');

  //Call the method from the service layer
  const result = await userAccountService.getUserBySessionToken(req.userId);

  ApiResponse.result(res, result, httpStatusCodes.OK);

  Logger.info('UserAccountController:getUserBySessionToken(): - end');
};

const createAndGetUsersWithProviderTypeandKeys = async (req, res) => {
  Logger.info('UserAccountController:createAndGetUsersWithProviderTypeandKeys(): - start');

  //Call the method from the service layer
  const user = await userAccountService.createAndGetUsersWithProviderTypeandKeys(
    req.body.providerType,
    req.body.providerKeys,
  );

  ApiResponse.result(res, user, httpStatusCodes.OK);

  Logger.info('UserController:createAndGetUsersWithProviderTypeandKeys(): - end');
};

const generateCSRFToken = async (req, res) => {
  Logger.info('UserAccountController:generateCSRFToken(): - start');

  const csrfToken = { csrfToken: req.csrfToken() };

  ApiResponse.result(res, csrfToken, httpStatusCodes.OK);

  Logger.info('UserController:generateCSRFToken(): - end');
};

const expireCookies = async (req, res) => {
  Logger.info('UserAccountController:expireCookies(): - start');

  res.clearCookie('token', {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  });

  res.clearCookie('_csrf', {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  });

  ApiResponse.result(res, {}, httpStatusCodes.OK);

  Logger.info('UserController:expireCookies(): - end');
};

//generating jwt token
const generateJWT = async (req, res) => {
  Logger.info('UserAccountController:generateJWT(): - start');

  const { userId } = req.params;

  const jwtToken = await userAccountService.generateJwt(userId);

  //setting cookie header
  res.cookie('token', jwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: parseInt(process.env.COOKIE_EXPIRY) * 1000, //cookie will expire after one year
  });

  ApiResponse.result(res, { jwtToken }, httpStatusCodes.OK);

  Logger.info('UserController:generateJWT(): - end');
};

export default {
  signUp,
  login,
  expireCookies,
  generateJWT,
  generateCSRFToken,
  updateUserScreenName,
  createAndGetUsersWithProviderTypeandKeys,
  getUserBySessionToken,
  updateUser,
  uploadImage
};
