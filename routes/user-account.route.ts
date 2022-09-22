import express from 'express';
import controller from '../controllers/user-account.controller';
import asyncHandler from '../utils/asyncHandler';
import isAuthenticated from '../middlewares/is-auth';
import multer from 'multer';
import path from 'path';
import helperFunctions from '../utils/helper';
import { userScreenNameValidator } from '../validators/user-account.validator';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, helperFunctions.generateString(20) + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const uploadFiles = upload.fields([{ name: 'image', maxCount: 1 }]);

const router = express.Router();

router.get('/getUserBySessionToken', isAuthenticated, asyncHandler(controller.getUserBySessionToken));
router.put('/updateUserScreenName/:userId', userScreenNameValidator(), asyncHandler(controller.updateUserScreenName));
router.put('/updateUser/:userId', uploadFiles, asyncHandler(controller.updateUser));
router.put('/uploadImage', uploadFiles, asyncHandler(controller.uploadImage));
router.post(
  '/createAndGetUsersWithProviderTypeandKeys',
  asyncHandler(controller.createAndGetUsersWithProviderTypeandKeys),
);

export = router;
