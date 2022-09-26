import { validationResult, check } from 'express-validator';
import locale from '../utils/locale';

const resultsValidator = (req) => {
  const messages: string[] = [];
  if (!validationResult(req).isEmpty()) {
    const errors = validationResult(req).array();
    for (const i of errors) {
      const objError = { error: i.msg };

      messages.push(JSON.stringify(objError));
    }
  }
  return messages;
};

const signUpValidator = () => {
  return [
    check('providerType').notEmpty().withMessage(locale.PROVIDER_TYPE_REQUIRED),
    check('providerKey').notEmpty().withMessage(locale.PROVIDER_KEY_REQUIRED),
  ];
};

const loginValidator = () => {
  return [
    check('providerType').notEmpty().withMessage(locale.PROVIDER_TYPE_REQUIRED),
    check('providerKey').notEmpty().withMessage(locale.PROVIDER_KEY_REQUIRED),
  ];
};

const userScreenNameValidator = () => {
  return [check('userScreenName').notEmpty().withMessage(locale.USER_SCREEN_NAME_REQUIRED)];
};
export { resultsValidator, signUpValidator, loginValidator, userScreenNameValidator };
