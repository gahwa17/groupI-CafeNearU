const model = require('../models/homeModel');
const { extractUserIDFromToken } = require('../util/common');
const errorHandler = require('../util/errorHandler');

function getRandomItemsFromArray(array, count) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray.slice(0, count);
}

async function processShopType(type, userId, cafeNumbersPerType, model) {
  const shopIds = await model.countTotalCafe(type);
  const targetShopIds = getRandomItemsFromArray(shopIds, cafeNumbersPerType);
  const shops = await model.getShopDataById(userId, targetShopIds);

  return shops.map((shop) => ({
    id: shop.id,
    name: shop.shop_name,
    primary_image: shop.primary_image,
    address: shop.address,
    operating_status: shop.operating_status,
    wishlist_item: shop.wishlist_item,
    min_order: shop.min_order,
    seats: shop.seat_info,
  }));
}

module.exports = {
  getHomepage: async (req, res) => {
    try {
      const cafeNumbersPerType = 4;

      const userId = req.user ? req.user.id : undefined;

      const [leisure, pet, workspace] = await Promise.all([
        processShopType('休閒', userId, cafeNumbersPerType, model),
        processShopType('寵物', userId, cafeNumbersPerType, model),
        processShopType('工作', userId, cafeNumbersPerType, model),
      ]);

      res.status(200).json({
        data: {
          shops: {
            leisure,
            pet,
            workspace,
          },
        },
      });
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
};
