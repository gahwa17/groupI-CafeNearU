const errorHandler = require('../util/errorHandler');
const { extractUserIDFromToken } = require('../util/common');

const model = require('../models/shopModel');
const { response } = require('express');

module.exports = {
  search: async (req, res) => {
    try {
      const itemsPerPage = 6;
      const itemsPerQuery = itemsPerPage + 1;
      const cursorStr = req.query.cursor;
      const cursor = cursorStr
        ? parseInt(Buffer.from(cursorStr, 'base64').toString('utf-8'))
        : 0;

      const {
        keyword = null,
        type,
        plug,
        wifi,
        smoking_area,
        cat,
        dog,
        min_order,
        no_time_limit,
      } = req.query;

      const userId = req.user ? req.user.id : undefined;
      // console.log('req.user:', req.user);

      const filterOptions = {
        keyword,
        type,
        plug,
        wifi,
        smoking_area,
        cat,
        dog,
        min_order,
        no_time_limit,
        userId,
        cursor,
        itemsPerQuery,
      };
      const result = await model.search(filterOptions);

      let shopArr = [];
      for (let i = 0; i < itemsPerPage; i++) {
        if (result[i] === undefined) {
          break;
        }
        const obj = {
          id: result[i].id,
          name: result[i].shop_name,
          primary_image: result[i].primary_image,
          address: result[i].address,
          operating_status: result[i].operating_status,
          wishlist_item: result[i].wishlist_item,
          min_order: result[i].min_order,
          seats: JSON.parse(`[${result[i].seat_info}]`),
        };
        shopArr.push(obj);
      }

      if (result.length < itemsPerQuery) {
        res.status(200).json({ data: { shops: shopArr, next_cursor: null } });
      } else {
        const nextPageIndex = shopArr[shopArr.length - 1].id;
        let nextCursor = Buffer.from(nextPageIndex.toString()).toString(
          'base64',
        );
        res
          .status(200)
          .json({ data: { shops: shopArr, next_cursor: nextCursor } });
      }
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  getBasicInfo: async (req, res) => {
    try {
      const cafeId = req.params.id * 1;

      const cafeProfileExistence = await model.findPublishedCafeProfileById(
        cafeId,
      );
      if (!cafeProfileExistence) {
        return errorHandler.clientError(res, 'profileNotFound', 404);
      }

      const userId = req.user ? req.user.id : undefined;

      const result = await model.getBasicInfo(cafeId, userId);

      const shopObj = {
        id: result[0].id,
        name: result[0].shop_name,
        type: result[0].type,
        nearest_MRT: result[0].nearest_MRT,
        wishlist_item: result[0].wishlist_item,
        introduction: result[0].introduction,
        opening_hour: result[0].opening_hour,
        closing_hour: result[0].closing_hour,
        primary_image: result[0].primary_image,
        secondary_image_1: result[0].secondary_image_1,
        secondary_image_2: result[0].secondary_image_2,
        address: result[0].address,
        telephone: result[0].telephone,
        facebook: result[0].facebook,
        ig: result[0].ig,
        line: result[0].line,
        rules: result[0].rules,
        service_and_equipment: result[0].service_and_equipment,
      };

      const menuCategories = [];
      const menuItems = [];
      for (let i = 0; i < result.length; i++) {
        menuCategories.push(result[i].category);
        const itemArr = result[i].menu_items.split(',');
        const itemObj = itemArr.map((el, index) => {
          const [name, price] = el.split('$');
          return {
            id: index + 1,
            name,
            price,
          };
        });
        menuItems.push(itemObj);
      }

      const menuObj = {
        menu: {
          last_updated: result[0].menu_last_updated,
          categories: menuCategories,
          items: menuItems,
        },
      };

      res.status(200).json({ data: { shop: { ...shopObj, ...menuObj } } });
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  getCurrentStatus: async (req, res) => {
    try {
      const cafeId = req.params.id * 1;

      const result = await model.getCurrentStatus(cafeId);
      const statusObj = {
        last_update: result[0].status_last_updated,
        operating_status: result[0].operating_status,
        seats: [],
      };
      for (let i = 0; i < result.length; i++) {
        const obj = {
          icon: result[i].icon,
          type: result[i].type,
          available_seats: result[i].available_seats,
          total_seats: result[i].total_seats,
        };
        statusObj.seats.push(obj);
      }
      res.status(200).json({ data: { shop: { ...statusObj } } });
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  createComment: async (req, res) => {
    try {
      const customer_id = extractUserIDFromToken(req);
      const cafe_id = parseInt(req.params.cafe_id);
      const data = req.body;

      const {
        context,
        is_quiet,
        total_rating,
        cleanliness,
        service,
        food,
        wifi,
        atmosphere,
      } = data;

      if (!context || context.trim() == '') {
        return errorHandler.clientError(res, 'missingContent', 400);
      }

      try {
        const result = await model.createComment(
          context,
          cafe_id,
          customer_id,
          total_rating,
          cleanliness,
          service,
          food,
          wifi,
          atmosphere,
          is_quiet,
        );

        const responseData = {
          data: {
            cafe: {
              id: cafe_id,
            },
            comment: {
              id: result[0].insertId,
            },
          },
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
  deleteComment: async (req, res) => {
    try {
      const comment_id = parseInt(req.params.comment_id);
      const commentExist = await model.checkCommentExist(comment_id);
      if (!commentExist) {
        return errorHandler.clientError(res, 'commentNotExist', 400);
      }
      try {
        await model.deleteComment(comment_id);

        const responseData = {
          data: {
            comment: {
              id: comment_id,
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
  getComments: async (req, res) => {
    try {
      const cafeID = parseInt(req.params.id);
      const loggedUserID = req.user ? req.user.id : null;
      const cursor = parseInt(req.query.cursor);

      // console.log('loggedUserID: ', loggedUserID);
      // console.log('cursor: ', cursor);

      try {
        let results = [];
        if (loggedUserID) {
          results = await model.getComments(loggedUserID, cafeID, cursor);
        } else {
          results = await model.getComments(loggedUserID, cafeID, cursor);
        }

        const responseData = {
          data: {
            summary: results.summary,
            comments: results.formattedComments,
            next_cursor: results.next_cursor,
          },
        };

        res.status(200).json(responseData);
      } catch (error) {
        // console.log('error:', error);
        errorHandler.serverError(res, error, 'sqlquery');
      }
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
};
