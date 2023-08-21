const express = require('express');

const router = express.Router();
const wishListController = require('../controllers/wishListController');
const { userAuthorization } = require('../util/common');

router.post('/', userAuthorization, wishListController.createWishList);
router.get('/:customer_id', userAuthorization, wishListController.getWishList);
router.get(
  '/:wishlist_id/cafe',
  userAuthorization,
  wishListController.getCafeFromWishList,
);
router.post(
  '/:wishlist_id/cafe/:cafe_id',
  userAuthorization,
  wishListController.addCafeToWishList,
);
router.delete(
  '/:wishlist_id/cafe/:cafe_id',
  userAuthorization,
  wishListController.deleteCafeFromWishList,
);

module.exports = router;
