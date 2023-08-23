const errorHandler = require('../util/errorHandler');
const {
  bcrypt,
  jwt,
  jwtSecret,
  extractUserIDFromToken,
  validateEmail,
  validateProvider,
} = require('../util/common');
const model = require('../models/shopOwnerModel');

function generateImageURL(image) {
  if (!image || !image[0]?.filename) {
    return null;
  }
  return `https://${process.env.HOST_NAME}/shopPics/${image[0].filename}`;
}

function hasJsonStructure(str) {
  if (typeof str !== 'string') {
    return false;
  }
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
}

function extractFilterData(rules, service_and_equipment) {
  try {
    rules = JSON.parse(rules);
    service_and_equipment = JSON.parse(service_and_equipment);
    const time_limit = rules[0].heading;
    const min_order = rules[1].heading;
    const plug = service_and_equipment[0].content;
    const wifi = service_and_equipment[1].content;
    const smoking_area = service_and_equipment[2].content;
    const cat = service_and_equipment[3].content;
    const dog = service_and_equipment[4].content;
    return [time_limit, min_order, plug, wifi, smoking_area, cat, dog];
  } catch (err) {
    return 'Extract data Failed';
  }
}

function checkInputField(basicInfoArr) {
  let allFieldsValid = true;
  basicInfoArr.forEach(function (el) {
    if (typeof el === 'undefined' || (typeof el === 'string' && !el.trim())) {
      allFieldsValid = false;
    }
  });
  return allFieldsValid;
}

module.exports = {
  ownerSignUp: async (req, res) => {
    try {
      const data = req.body;

      if (Object.keys(data).length !== 3) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }

      let { name, email, password } = data;

      name = name.trim();
      email = email.trim();
      password = password.trim();

      if (!name || !email || !password) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }
      if (!validateEmail(email)) {
        return errorHandler.clientError(res, 'emailValidate', 400);
      }
      try {
        const existingUser = await model.getByEmail(email);

        if (existingUser) {
          errorHandler.clientError(res, 'emailExist', 403);
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);

          const [result] = await model.insertNewOwner(
            name,
            email,
            hashedPassword,
          );
          const userID = result.insertId;

          const user = await model.getByID(userID);

          const identity = 'shopOwner';

          const payload = {
            id: user.id,
            provider: user.provider,
            name: user.name,
            email: user.email,
            identity: identity,
          };

          const accessToken = jwt.sign(payload, jwtSecret);

          const responseData = {
            data: {
              access_token: accessToken,
              user: payload,
            },
          };
          res.status(200).json(responseData);
        }
      } catch (error) {
        errorHandler.serverError(res, error, 'sqlquery');
      }
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  ownerSignIn: async (req, res) => {
    try {
      const data = req.body;

      if (Object.keys(data).length !== 3) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }
      let { provider, email, password } = data;

      provider = provider.trim();
      email = email.trim();
      password = password.trim();

      // Validate user input
      if (!provider || !email || !password) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }
      try {
        // Validate if user exist in our database
        const user = await model.getByEmail(email);
        if (
          user &&
          validateProvider(provider) &&
          (await bcrypt.compare(password, user.password))
        ) {
          const identity = 'shopOwner';

          const payload = {
            id: user.id,
            provider: user.provider,
            name: user.user_name,
            email: user.email,
            identity: identity,
          };
          const accessToken = jwt.sign(payload, jwtSecret);

          const responseData = {
            data: {
              access_token: accessToken,
              user: payload,
            },
          };
          res.status(200).json(responseData);
        } else {
          errorHandler.clientError(res, 'signInFailed', 403);
        }
      } catch (error) {
        errorHandler.serverError(res, error, 'sqlquery');
      }
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  getOwnerProfile: async (req, res) => {
    try {
      const currentID = extractUserIDFromToken(req);
      const userRow = await model.getByID(currentID);

      const user = {
        id: userRow.id,
        name: userRow.user_name,
        email: userRow.email,
        provider: userRow.provider,
      };

      const responseData = {
        data: { user },
      };

      res.status(200).json(responseData);
    } catch (error) {
      errorHandler.clientError(res, 'userNotFound', 400);
    }
  },
  updateOwnerProfile: async (req, res) => {
    try {
      const currentID = extractUserIDFromToken(req);
      const { name, email } = req.body;

      if (!name && !email) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }

      if (email && !validateEmail(email)) {
        return errorHandler.clientError(res, 'emailValidate', 400);
      }

      try {
        await model.updateProfile(currentID, name, email);

        const responseData = {
          data: {
            user: {
              id: currentID,
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
  updateOwnerEmail: async (req, res) => {
    try {
      const currentID = extractUserIDFromToken(req);
      const { name, email } = req.body;

      if (!validateEmail(email)) {
        return errorHandler.clientError(res, 'emailValidate', 400);
      }

      try {
        await model.updateProfile(currentID, name, email);

        const responseData = {
          data: {
            user: {
              id: currentID,
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
  updateOwnerPassword: async (req, res) => {
    const currentID = extractUserIDFromToken(req);
    const { new_password } = req.body;

    if (new_password.trim() === '') {
      return errorHandler.clientError(res, 'passwordValidate', 400);
    }

    const userRow = await model.getByID(currentID);
    if (await bcrypt.compare(new_password, userRow.password)) {
      return errorHandler.clientError(res, 'duplicatePassword', 403);
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await model.updatePassword(currentID, hashedPassword);

    const responseData = {
      data: {
        user: {
          id: currentID,
        },
      },
    };

    res.status(200).json(responseData);
  },
  basicInfoUpdate: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (!header.includes('multipart/form-data')) {
        return errorHandler.clientError(res, 'contentTypeValidate', 400);
      }

      const userId = extractUserIDFromToken(req);

      if (typeof req.files.primary_image === 'undefined') {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }

      const primaryImg = generateImageURL(req.files.primary_image);
      const secondaryImg1 = generateImageURL(req.files.secondary_image_1);
      const secondaryImg2 = generateImageURL(req.files.secondary_image_2);

      const {
        name,
        type,
        nearest_MRT = null,
        introduction = null,
        opening_hour,
        closing_hour,
        address,
        telephone,
        facebook = null,
        ig = null,
        line = null,
        rules,
        service_and_equipment,
      } = req.body;

      if (!hasJsonStructure(opening_hour)) {
        return errorHandler.clientError(res, 'jsonValidate', 400);
      }
      if (!hasJsonStructure(closing_hour)) {
        return errorHandler.clientError(res, 'jsonValidate', 400);
      }
      if (!hasJsonStructure(rules)) {
        return errorHandler.clientError(res, 'jsonValidate', 400);
      }
      if (!hasJsonStructure(service_and_equipment)) {
        return errorHandler.clientError(res, 'jsonValidate', 400);
      }
      const filterType = extractFilterData(rules, service_and_equipment);
      if (filterType === 'Extract data Failed') {
        return errorHandler.clientError(res, 'extractDataFailed', 400);
      }
      const basicInfo = [
        name,
        type,
        nearest_MRT,
        introduction,
        opening_hour,
        closing_hour,
        address,
        telephone,
        facebook,
        ig,
        line,
        ...filterType,
        primaryImg,
        secondaryImg1,
        secondaryImg2,
      ];
      if (!checkInputField(basicInfo)) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }

      const user = await model.getByID(userId);
      if (!user) {
        return errorHandler.clientError(res, 'emailExist', 403);
      }

      await model.basicInfoUpdate(
        userId,
        basicInfo,
        rules,
        service_and_equipment,
      );

      res.status(200).json({
        data: {
          shops: {
            id: userId,
          },
        },
      });
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  menuUpdate: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        return errorHandler.clientError(res, 'contentTypeValidate', 400);
      }

      const userId = extractUserIDFromToken(req);

      const { menu } = req.body;
      if (!menu || menu.length === 0) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }

      await model.menuUpdate(userId, menu);

      res.status(200).json({
        data: {
          shops: {
            id: userId,
          },
        },
      });
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  setSeatType: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        return errorHandler.clientError(res, 'contentTypeValidate', 400);
      }

      const userId = extractUserIDFromToken(req);

      const { seats } = req.body;
      if (!seats || seats.length === 0) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }

      await model.setSeatType(userId, seats);

      res.status(200).json({
        data: {
          shops: {
            id: userId,
          },
        },
      });
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  statusUpdate: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        return errorHandler.clientError(res, 'contentTypeValidate', 400);
      }

      const userId = extractUserIDFromToken(req);

      const { operating_status, type, available_seats } = req.body;

      if (
        !operating_status ||
        !type ||
        !('available_seats' in req.body) ||
        !operating_status.trim() ||
        !type.trim()
      ) {
        return errorHandler.clientError(res, 'inputFeild', 400);
      }

      const result = await model.checkSeatSetting(userId, type);
      if (result === 'Seat Not Found') {
        return errorHandler.clientError(res, 'seatNotFound', 400);
      }

      await model.statusUpdate(userId, operating_status, type, available_seats);

      res.status(200).json({
        data: {
          shops: {
            id: userId,
          },
        },
      });
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  changeProfilePubStatus: async (req, res) => {
    try {
      const header = req.get('Content-Type');
      if (header !== 'application/json') {
        return errorHandler.clientError(res, 'contentTypeValidate', 400);
      }

      const userId = extractUserIDFromToken(req);

      const { is_published } = req.body;
      if (typeof is_published !== 'boolean') {
        return errorHandler.clientError(res, 'booleanValidate', 400);
      }
      if (is_published === false) {
        const isUnpub = await model.isUnpub(userId);
        if (isUnpub) {
          return errorHandler.clientError(res, 'UnpublishedProfile', 400);
        }
      }
      const checkInfo = await model.canBePublished(userId);
      if (
        checkInfo.shop_name === null ||
        checkInfo.menu_last_updated === null ||
        checkInfo.status_last_updated === null
      ) {
        return errorHandler.clientError(res, 'missingRequiredInfo', 400);
      }

      await model.changeProfilePubStatus(userId, is_published);
      res.status(200).json({
        data: {
          shops: {
            id: userId,
          },
        },
      });
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  isNewShopOwner: async (req, res) => {
    try {
      const userId = extractUserIDFromToken(req);

      const checkInfo = await model.canBePublished(userId);
      if (
        checkInfo.shop_name === null ||
        checkInfo.menu_last_updated === null ||
        checkInfo.status_last_updated === null
      ) {
        res.status(200).json({
          data: {
            new_owner: true,
          },
        });
      } else {
        res.status(200).json({
          data: {
            new_owner: false,
          },
        });
      }
    } catch (error) {
      errorHandler.serverError(res, error, 'internalServer');
    }
  },
  getHistoryInput: async (req, res) => {
    if (req.user.identity !== 'shopOwner') {
      return errorHandler.clientError(res, 'accessDenied', 400);
    }
    const userId = req.user.id;
    const result = await model.getHistoryInput(userId);

    const shopObj = {
      id: result[0].id,
      name: result[0].shop_name,
      type: result[0].type,
      nearest_MRT: result[0].nearst_MRT,
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

    let menuCategories = [];
    let menuItems = [];
    if (result[0].categories !== null && result[0].menu_items !== null) {
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
    } else {
      menuCategories = null;
      menuItems = null;
    }

    const menuObj = {
      menu: {
        last_updated: result[0].menu_last_updated,
        categories: menuCategories,
        items: menuItems,
      },
    };

    res.status(200).json({ data: { shop: { ...shopObj, ...menuObj } } });
    return 'history';
  },
};
