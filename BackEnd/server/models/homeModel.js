const pool = require('../util/db');

module.exports = {
  /*getHomepage: async (userId) => {
    try {
      let result;
      if (userId) {
        const query = `
        SELECT * FROM (
          SELECT shops.id, shop_name, primary_image, operating_status, min_order, 
              (
                  SELECT JSON_ARRAYAGG(
                      JSON_OBJECT('icon', seats.icon, 'type', seats.type, 
                                  'available_seats', seats.available_seats, 'total_seats', seats.total_seats)
                  ) FROM seats WHERE seats.cafe_id = shops.id
              ) AS seat_info, 
              IF(
                (SELECT wishlists.id FROM wishlists 
                LEFT JOIN wishlist_items 
                ON wishlists.id = wishlist_items.wishlist_id 
                WHERE wishlist_items.cafe_id = shops.id AND customer_id = ? ) > 0, true, false) AS wishlist_item
          FROM shops
          WHERE shops.type = '休閒'
          ORDER BY RAND()
          LIMIT 2
      ) AS leisure_shops
      UNION ALL
      SELECT * FROM (
          SELECT shops.id, shop_name, primary_image, operating_status, min_order, 
              (
                  SELECT JSON_ARRAYAGG(
                      JSON_OBJECT('icon', seats.icon, 'type', seats.type, 
                                  'available_seats', seats.available_seats, 'total_seats', seats.total_seats)
                  ) FROM seats WHERE seats.cafe_id = shops.id
              ) AS seat_info,
              IF(
                (SELECT wishlists.id FROM wishlists 
                LEFT JOIN wishlist_items 
                ON wishlists.id = wishlist_items.wishlist_id 
                WHERE wishlist_items.cafe_id = shops.id AND customer_id = ? ) > 0, true, false) AS wishlist_item
          FROM shops
          WHERE shops.type = '工作'
          ORDER BY RAND()
          LIMIT 2
      ) AS work_shops
      UNION ALL
      SELECT * FROM (
          SELECT shops.id, shop_name, primary_image, operating_status, min_order, 
              (
                  SELECT JSON_ARRAYAGG(
                      JSON_OBJECT('icon', seats.icon, 'type', seats.type, 
                                  'available_seats', seats.available_seats, 'total_seats', seats.total_seats)
                  ) FROM seats WHERE seats.cafe_id = shops.id
              ) AS seat_info,
              IF(
                (SELECT wishlists.id FROM wishlists 
                LEFT JOIN wishlist_items 
                ON wishlists.id = wishlist_items.wishlist_id 
                WHERE wishlist_items.cafe_id = shops.id AND customer_id = ? ) > 0, true, false) AS wishlist_item
          FROM shops
          WHERE shops.type = '寵物'
          ORDER BY RAND()
          LIMIT 2
      ) AS pet_shops;
`;

        [result] = await pool.query(query, [userId, userId, userId]);
      } else {
        const query = `
        SELECT * FROM (
          SELECT shops.id, shop_name, primary_image, operating_status, min_order, 
              (
                  SELECT JSON_ARRAYAGG(
                      JSON_OBJECT('icon', seats.icon, 'type', seats.type, 
                                  'available_seats', seats.available_seats, 'total_seats', seats.total_seats)
                  ) FROM seats WHERE seats.cafe_id = shops.id
              ) AS seat_info
          FROM shops
          WHERE shops.type = '休閒'
          ORDER BY RAND()
          LIMIT 2
      ) AS leisure_shops
      UNION ALL
      SELECT * FROM (
          SELECT shops.id, shop_name, primary_image, operating_status, min_order, 
              (
                  SELECT JSON_ARRAYAGG(
                      JSON_OBJECT('icon', seats.icon, 'type', seats.type, 
                                  'available_seats', seats.available_seats, 'total_seats', seats.total_seats)
                  ) FROM seats WHERE seats.cafe_id = shops.id
              ) AS seat_info
          FROM shops
          WHERE shops.type = '工作'
          ORDER BY RAND()
          LIMIT 2
      ) AS work_shops
      UNION ALL
      SELECT * FROM (
          SELECT shops.id, shop_name, primary_image, operating_status, min_order, 
              (
                  SELECT JSON_ARRAYAGG(
                      JSON_OBJECT('icon', seats.icon, 'type', seats.type, 
                                  'available_seats', seats.available_seats, 'total_seats', seats.total_seats)
                  ) FROM seats WHERE seats.cafe_id = shops.id
              ) AS seat_info
          FROM shops
          WHERE shops.type = '寵物'
          ORDER BY RAND()
          LIMIT 2
      ) AS pet_shops;
`;

        [result] = await pool.query(query);
      }
      console.log(result);
      return result;
    } finally {
      pool.releaseConnection();
    }
  },*/
  getShopDataById: async (userId, idArr) => {
    try {
      let conditions = 'WHERE';
      for (let i = 0; i < idArr.length; i++) {
        conditions += ` id = ${idArr[i].id}`;
        if (i < idArr.length - 1) {
          conditions += ` OR`;
        }
      }
      let wishlist = '';
      if (userId) {
        wishlist = `, IF(
          (SELECT wishlists.id FROM wishlists 
          LEFT JOIN wishlist_items 
          ON wishlists.id = wishlist_items.wishlist_id 
          WHERE wishlist_items.cafe_id = shops.id AND customer_id = ? ) > 0, true, false) AS wishlist_item`;
      }
      const query = `
          SELECT shops.id, shop_name, primary_image, operating_status, min_order, 
          (
              SELECT JSON_ARRAYAGG(
                  JSON_OBJECT('icon', seats.icon, 'type', seats.type, 
                              'available_seats', seats.available_seats, 'total_seats', seats.total_seats)
              ) FROM seats WHERE seats.cafe_id = shops.id
          ) AS seat_info
          ${wishlist}
        FROM shops
        ${conditions}
        LIMIT ${idArr.length}`;
      const [result] = await pool.query(query, userId);
      return result;
    } finally {
      pool.releaseConnection();
    }
  },
  countTotalCafe: async (type) => {
    //  要加上 is_published = true
    const query = `SELECT id FROM shops WHERE type = "${type}";`;
    try {
      [result] = await pool.query(query);
      return result;
    } finally {
      pool.releaseConnection();
    }
  },
};
