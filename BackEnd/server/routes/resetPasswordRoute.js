const express = require('express');
const router = express.Router();

const resetPasswordController = require('../controllers/resetPasswordController');

router.post(
  '/request-password-reset',
  resetPasswordController.resetPasswordRequest,
);
router.put('/reset-password', resetPasswordController.resetPassword);

module.exports = router;
