const pool = require('../util/db');

module.exports = {
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
        wishlist = `, 
          (SELECT wishlists.id FROM wishlists 
          LEFT JOIN wishlist_items 
          ON wishlists.id = wishlist_items.wishlist_id 
          WHERE wishlist_items.cafe_id = shops.id AND customer_id = ? ) AS wishlist_item`;
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
    const query = `SELECT id FROM shops WHERE type = "${type}" AND is_published = true;`;
    try {
      [result] = await pool.query(query);
      return result;
    } finally {
      pool.releaseConnection();
    }
  },
};
