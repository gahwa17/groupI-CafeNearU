const pool = require('../util/db');

module.exports = {
  search: async (filterOptions) => {
    // console.log('filterOptions:', filterOptions);
    const {
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
    } = filterOptions;

    let queryParams = [cursor];

    let wishlist_item = '';
    if (userId) {
      wishlist_item += `,
          (SELECT wishlists.id FROM wishlists 
          LEFT JOIN wishlist_items 
          ON wishlists.id = wishlist_items.wishlist_id 
          WHERE wishlist_items.cafe_id = shops.id AND customer_id = ? ) AS wishlist_item`;
      queryParams.unshift(userId);
    }

    let conditions = '';
    if (keyword) {
      conditions += ` AND (shop_name LIKE ? OR address LIKE ?)`;
      queryParams.push(`%${keyword}%`, `%${keyword}%`);
    }
    if (type) {
      conditions += ` AND shops.type = ?`;
      queryParams.push(`${type}`);
    }
    if (plug) {
      conditions += ` AND plug = true`;
    }
    if (wifi) {
      conditions += ` AND wifi = true`;
    }
    if (smoking_area) {
      conditions += ` AND smoking_area = true`;
    }
    if (cat) {
      conditions += ` AND cat = true`;
    }
    if (dog) {
      conditions += ` AND dog = true`;
    }
    if (min_order) {
      conditions += ` AND min_order <= ?`;
      queryParams.push(`${min_order}`);
    }
    if (no_time_limit) {
      conditions += ` AND time_limit = false`;
    }

    let query = `SELECT shops.id, shop_name, primary_image,
    address, operating_status, min_order,
    GROUP_CONCAT(
      '{ "icon": "', seats.icon, '", "type": "', seats.type,
      '", "available_seats": ', seats.available_seats,
      ', "total_seats": ', seats.total_seats, ' }'
    ) AS seat_info
    ${wishlist_item}
    FROM shops
    LEFT JOIN seats ON shops.id = seats.cafe_id
    WHERE is_published = true AND shops.id > ?${conditions}
    GROUP BY shops.id
    LIMIT ${itemsPerQuery} ;`;

    try {
      const [result] = await pool.query(query, queryParams);
      return result;
    } finally {
      await pool.releaseConnection();
    }
  },
  getBasicInfo: async (cafeId, userId) => {
    let queryParams = [cafeId];

    let wishlistQuery = '';

    if (userId) {
      wishlistQuery += `, IF(
          (SELECT wishlists.id FROM wishlists 
          LEFT JOIN wishlist_items 
          ON wishlists.id = wishlist_items.wishlist_id 
          WHERE wishlist_items.cafe_id = shops.id AND customer_id = ? ) > 0, true, false) AS wishlist_item`;
      queryParams.unshift(userId);
    }

    let query = `
      SELECT shops.id, shop_name, type, introduction, opening_hour, closing_hour, 
      primary_image, secondary_image_1, secondary_image_2, address, telephone, facebook, ig, line, 
      rules, service_and_equipment, nearest_MRT,
      DATE_FORMAT(menu_last_updated, "%Y-%m-%d %H:%i:%s") AS menu_last_updated, 
      menus.category, 
      GROUP_CONCAT(CONCAT(menus.item, '$', menus.price)) AS menu_items
      ${wishlistQuery}
      FROM shops
      INNER JOIN menus ON shops.id = menus.cafe_id
      WHERE shops.id = ? AND is_published = true
      GROUP BY shops.id, menus.category`;

    try {
      const [result] = await pool.query(query, [...queryParams]);
      return result;
    } finally {
      await pool.releaseConnection();
    }
  },
  getCurrentStatus: async (cafeId) => {
    const query = `
      SELECT DATE_FORMAT(status_last_updated, "%Y-%m-%d %H:%i:%s") AS status_last_updated, 
      operating_status, icon, seats.type, available_seats, total_seats
      FROM shops
      INNER JOIN seats ON shops.id = seats.cafe_id
      WHERE shops.id = ?`;
    try {
      const [result] = await pool.query(query, cafeId);
      return result;
    } finally {
      await pool.releaseConnection();
    }
  },
  createComment: async (
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
  ) => {
    const query =
      'INSERT INTO `comments` (`context`, `cafe_id`, `customer_id`, `total_rating`, `cleanliness`, `service`, `food`, `wifi`, `atmosphere`, `is_quiet`,`created_at`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(), "UTC", "Asia/Taipei"))';
    try {
      return await pool.query(query, [
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
      ]);
    } finally {
      pool.releaseConnection();
    }
  },
  deleteComment: async (comment_id) => {
    const query = 'DELETE FROM `comments` WHERE `id` = ?';
    try {
      return await pool.query(query, [comment_id]);
    } finally {
      pool.releaseConnection();
    }
  },
  checkCommentExist: async (comment_id) => {
    const query = 'SELECT `id` FROM `comments` WHERE `id` = ?';
    try {
      const [result] = await pool.query(query, [comment_id]);
      return result[0];
    } finally {
      pool.releaseConnection();
    }
  },
  getComments: async (loggedUserID, cafeID, cursor) => {
    const summaryQuery = `
    SELECT
      cd.comment_count AS total_comments,
      CONCAT(ROUND(cd.is_quiet * 100), '%') AS is_quiet,
      cd.average_total_rating,
      cd.average_cleanliness,
      cd.average_service,
      cd.average_food,
      cd.average_wifi,
      cd.average_atmosphere
    FROM comment_dashboard cd
    WHERE
        cd.cafe_id = ?
    ORDER BY
        cd.id DESC`;

    const [summary] = await pool.query(summaryQuery, cafeID);
    let params = [];
    let comments = null;

    // 有登入
    if (loggedUserID) {
      if (cursor) {
        const query = `
        WITH UserComments AS (
          SELECT c.id, c.total_rating, DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, c.context, cr.id as user_id, cr.name as user_name, cr.picture as user_picture, cr.school as user_school
          FROM comments c
          JOIN customers cr ON c.customer_id = cr.id
          WHERE c.customer_id = ? AND c.cafe_id = ?
        ),
        OtherComments AS (
            SELECT c.id, c.total_rating, DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, c.context, cr.id as user_id, cr.name as user_name, cr.picture as user_picture, cr.school as user_school
            FROM comments c
            JOIN customers cr ON c.customer_id = cr.id
            WHERE c.customer_id != ? AND c.cafe_id = ? AND c.id <= ?
            ORDER BY c.id DESC LIMIT 6
        )
        SELECT * FROM UserComments
        UNION ALL
        SELECT * FROM OtherComments;
        `;
        params = [loggedUserID, cafeID, loggedUserID, cafeID, cursor];
        [comments] = await pool.query(query, params);
      } else {
        const query = `
        WITH UserComments AS (
          SELECT c.id, c.total_rating, DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, c.context, cr.id as user_id, cr.name as user_name, cr.picture as user_picture, cr.school as user_school
          FROM comments c
          JOIN customers cr ON c.customer_id = cr.id
          WHERE c.customer_id = ? AND c.cafe_id = ?
        ),
        OtherComments AS (
            SELECT c.id, c.total_rating, DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, c.context, cr.id as user_id, cr.name as user_name, cr.picture as user_picture, cr.school as user_school
            FROM comments c
            JOIN customers cr ON c.customer_id = cr.id
            WHERE c.customer_id != ? AND c.cafe_id = ?
            ORDER BY c.id DESC LIMIT 6
        )
        SELECT * FROM UserComments
        UNION ALL
        SELECT * FROM OtherComments;
        `;
        params = [loggedUserID, cafeID, loggedUserID, cafeID];
        [comments] = await pool.query(query, params);
      }
    }
    // 沒登入
    else {
      if (cursor) {
        const query = `
        SELECT c.id, c.total_rating, DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, c.context, cr.id as user_id, cr.name as user_name, cr.picture as user_picture, cr.school as user_school
        FROM comments c
        JOIN customers cr ON c.customer_id = cr.id
        WHERE c.cafe_id = ? AND c.id <= ?
        ORDER BY c.id DESC LIMIT 6
        `;
        params = [cafeID, cursor];
        [comments] = await pool.query(query, params);
      } else {
        const query = `
        SELECT c.id, c.total_rating, DATE_FORMAT(c.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, c.context, cr.id as user_id, cr.name as user_name, cr.picture as user_picture, cr.school as user_school
        FROM comments c
        JOIN customers cr ON c.customer_id = cr.id
        WHERE c.cafe_id = ?
        ORDER BY c.id DESC LIMIT 6
        `;
        params = [cafeID];
        [comments] = await pool.query(query, params);
      }
    }

    let formattedComments = [];
    let next_cursor = null;

    comments.forEach((row, index) => {
      if (!loggedUserID && index === 5) {
        next_cursor = row.id;
        return;
      }

      if (loggedUserID && index === 6) {
        next_cursor = row.id;
        return;
      }

      const comment = {
        id: row.id,
        rating: row.total_rating,
        created_at: row.created_at,
        context: row.context,
        user: {
          id: row.user_id,
          name: row.user_name,
          picture: row.user_picture,
          school: row.user_school,
        },
      };

      formattedComments.push(comment);
    });

    // console.log('formattedComments:', formattedComments);
    return { summary: summary[0], formattedComments, next_cursor };
  },
  findPublishedCafeProfileById: async (cafeId) => {
    const query = `SELECT id FROM shops WHERE id = ? AND is_published = true`;
    try {
      const [[result]] = await pool.query(query, cafeId);
      return result;
    } finally {
      await pool.releaseConnection();
    }
  },
};
