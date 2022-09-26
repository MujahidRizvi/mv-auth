import express from 'express';
import controller from '../controllers/user-account.controller';
import asyncHandler from '../utils/asyncHandler';
import { signUpValidator, loginValidator } from '../validators/user-account.validator';

const router = express.Router();

router.post('/signUp', signUpValidator(), asyncHandler(controller.signUp));
router.post('/login', loginValidator(), asyncHandler(controller.login));
router.get('/generate-jwt/:userId', asyncHandler(controller.generateJWT));
router.get('/expire-cookies', controller.expireCookies);
router.get('/csrf-token', controller.generateCSRFToken);

export = router;
