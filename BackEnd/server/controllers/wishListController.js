const errorHandler = require('../util/errorHandler');
const { extractUserIDFromToken } = require('../util/common');

const WishList = require('../models/wishListModel');
const wishListModel = require('../models/wishListModel');

module.exports = {
  createWishList: async (req, res) => {
    try {
      const customer_id = extractUserIDFromToken(req);
      let { wishlist_name } = req.body;

      if (!wishlist_name || wishlist_name.trim() === '') {
        return errorHandler.clientError(res, 'missingContent', 400);
      }
      try {
        const result = await WishList.createWishList(
          customer_id,
          wishlist_name,
        );

        const responseData = {
          data: {
            wishlist: {
              id: result[0].insertId,
            },
          },
        };

        res.status(200).json(responseData);
      } catch (error) {
        errorHandler.serverError(res, error, 'sqlquery');
      }
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  getWishList: async (req, res) => {
    try {
      const customer_id = extractUserIDFromToken(req);

      try {
        const result = await wishListModel.getWishList(customer_id);

        const wishlists = result.map((item) => ({
          id: item.id,
          name: item.name,
          cover: item.cover,
        }));

        const responseData = {
          data: { wishlists },
        };

        res.status(200).json(responseData);
      } catch (error) {
        errorHandler.serverError(res, error, 'sqlquery');
      }
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  addCafeToWishList: async (req, res) => {
    try {
      const customer_id = extractUserIDFromToken(req);
      const wishlist_id = parseInt(req.params.wishlist_id);
      const cafe_id = parseInt(req.params.cafe_id);

      if (!wishlist_id || !cafe_id) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }

      const isWishlistExist = await wishListModel.isWishlistExist(
        wishlist_id,
        customer_id,
      );

      if (!isWishlistExist) {
        return errorHandler.clientError(res, 'wishlistNotExists', 400);
      }

      const isCafeInWishlist = await wishListModel.isCafeInWishlist(
        wishlist_id,
        cafe_id,
      );

      if (isCafeInWishlist) {
        return errorHandler.clientError(res, 'cafeExistsInWishlist', 400);
      }

      const isCafeAddedByCustomer = await wishListModel.isCafeAddedByCustomer(
        customer_id,
        cafe_id,
      );

      if (isCafeAddedByCustomer) {
        return errorHandler.clientError(res, 'cafeAlreadyWishlist', 400);
      }

      try {
        await wishListModel.addCafeToWishList(wishlist_id, cafe_id);

        const responseData = {
          data: {
            wishlist: {
              id: wishlist_id,
            },
            cafe: {
              id: cafe_id,
            },
          },
        };

        res.status(200).json(responseData);
      } catch (error) {
        errorHandler.serverError(res, error, 'sqlquery');
      }
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  deleteCafeFromWishList: async (req, res) => {
    try {
      const customer_id = extractUserIDFromToken(req);
      const wishlist_id = parseInt(req.params.wishlist_id);
      const cafe_id = parseInt(req.params.cafe_id);

      if (!wishlist_id || !cafe_id) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }

      const isWishlistExist = await wishListModel.isWishlistExist(
        wishlist_id,
        customer_id,
      );

      if (!isWishlistExist) {
        return errorHandler.clientError(res, 'wishlistNotExists', 400);
      }

      const isCafeInWishlist = await wishListModel.isCafeInWishlist(
        wishlist_id,
        cafe_id,
      );
      if (!isCafeInWishlist) {
        return errorHandler.clientError(res, 'cafeNotExistsInWishlist', 400);
      }
      try {
        await wishListModel.deleteCafeFromWishList(wishlist_id, cafe_id);

        const responseData = {
          data: {
            wishlist: {
              id: wishlist_id,
            },
            cafe: {
              id: cafe_id,
            },
          },
        };

        res.status(200).json(responseData);
      } catch (error) {
        errorHandler.serverError(res, error, 'sqlquery');
      }
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  getCafeFromWishList: async (req, res) => {
    try {
      const { wishlist_id } = req.params;
      const customer_id = extractUserIDFromToken(req);

      const isWishlistExist = await wishListModel.isWishlistExist(
        wishlist_id,
        customer_id,
      );
      if (!isWishlistExist) {
        return errorHandler.clientError(res, 'wishlistNotExists', 400);
      }

      try {
        const result = await wishListModel.getCafeFromWishList(wishlist_id);
        const shops = result.map((shop) => {
          const seats = [];

          const seatIcons = shop.seat_icons.split(',');
          const seatTypes = shop.seat_types.split(',');
          const availableSeats = shop.available_seats.split(',');
          const totalSeats = shop.total_seats.split(',');

          for (let i = 0; i < seatIcons.length; i++) {
            seats.push({
              icon: seatIcons[i],
              type: seatTypes[i],
              available_seats: parseInt(availableSeats[i]),
              total_seats: parseInt(totalSeats[i]),
            });
          }

          return {
            id: shop.id,
            name: shop.name,
            primary_image: shop.primary_image,
            address: shop.address,
            opening_hour: shop.opening_hour,
            seats: seats,
            min_order: shop.min_order,
          };
        });

        const responseData = {
          data: { shops },
        };
        res.status(200).json(responseData);
      } catch (error) {
        console.log(error);
        errorHandler.serverError(res, error, 'sqlquery');
      }
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
};
