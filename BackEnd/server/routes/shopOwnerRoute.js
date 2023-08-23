const express = require('express');

const router = express.Router();
const controller = require('../controllers/shopOwnerController');
const pictureUpload = require('../util/pictureUpload');
const { userAuthorization, shopOwnerAuth } = require('../util/common');

router.post('/signup', controller.ownerSignUp);
router.post('/signin', controller.ownerSignIn);
router.put(
  '/update-password',
  userAuthorization,
  controller.updateOwnerPassword,
);
router.get('/profile', userAuthorization, controller.getOwnerProfile);
router.patch('/profile', userAuthorization, controller.updateOwnerProfile);

router.put(
  '/basic-info',
  userAuthorization,
  pictureUpload.setting().fields([
    { name: 'primary_image', maxCount: 1 },
    { name: 'secondary_image_1', maxCount: 1 },
    { name: 'secondary_image_2', maxCount: 1 },
  ]),
  controller.basicInfoUpdate,
);
router.put('/menu', userAuthorization, controller.menuUpdate);
router.post('/seat-setting', userAuthorization, controller.setSeatType);
router.put('/status', userAuthorization, controller.statusUpdate);
router.post('/publish', userAuthorization, controller.changeProfilePubStatus);
router.post('/unpublish', userAuthorization, controller.changeProfilePubStatus);
router.get('/account-status', userAuthorization, controller.isNewShopOwner);
router.get('/previous-inputs', shopOwnerAuth, controller.getHistoryInput);

module.exports = router;
