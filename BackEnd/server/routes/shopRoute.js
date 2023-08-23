const express = require('express');

const router = express.Router();
const controller = require('../controllers/shopController');
const {
  userAuthorization,
  checkCustomerLogin,
  returnHeader,
} = require('../util/common');


router.get('/search', checkCustomerLogin, controller.search);
router.get('/:id/basic-info', checkCustomerLogin, controller.getBasicInfo);
router.get('/:id/status', controller.getCurrentStatus);
router.post('/:cafe_id/comments', userAuthorization, controller.createComment);
router.delete(
  '/:cafe_id/comments/:comment_id',
  userAuthorization,
  controller.deleteComment,
);
router.get('/:id/comments', checkCustomerLogin, controller.getComments);

module.exports = router;
