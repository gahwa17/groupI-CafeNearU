const pool = require('../util/db');

module.exports = {
  createWishList: async (customer_id, wishlist_name) => {
    const query = 'INSERT INTO wishlists (customer_id, name) VALUES (?, ?)';
    try {
      return await pool.query(query, [customer_id, wishlist_name]);
    } finally {
      pool.releaseConnection();
    }
  },
  getWishList: async (customer_id) => {
    const query = `
    SELECT
      DISTINCT w.id,
      w.name,
      (COALESCE(s.primary_image, 'https://13.211.10.154/shopPics/default-cover.jpeg')) AS cover
    FROM
      wishlists w
    LEFT JOIN wishlist_items wi 
      ON w.id = wi.wishlist_id
    LEFT JOIN shops s 
      ON wi.cafe_id = s.id
    WHERE
      w.customer_id = ?
    GROUP BY w.id, w.name
    ORDER BY w.id ASC`;
    try {
      const [results] = await pool.query(query, [customer_id]);
      return results;
    } finally {
      pool.releaseConnection();
    }
  },
  addCafeToWishList: async (wishlist_id, cafe_id) => {
    const query = `INSERT INTO wishlist_items (wishlist_id, cafe_id) VALUES (?, ?)`;
    try {
      return await pool.query(query, [wishlist_id, cafe_id]);
    } finally {
      pool.releaseConnection();
    }
  },
  deleteCafeFromWishList: async (wishlist_id, cafe_id) => {
    const query = `DELETE FROM wishlist_items WHERE wishlist_id = ? AND cafe_id = ?`;
    try {
      return await pool.query(query, [wishlist_id, cafe_id]);
    } finally {
      pool.releaseConnection();
    }
  },
  getCafeFromWishList: async (wishlist_id) => {
    const query = `
    SELECT
    s.id,
    s.shop_name AS name,
    s.primary_image,
    s.address,
    s.opening_hour,
    s.min_order,
    GROUP_CONCAT(se.icon) AS seat_icons,
    GROUP_CONCAT(se.type) AS seat_types,
    GROUP_CONCAT(se.available_seats) AS available_seats,
    GROUP_CONCAT(se.total_seats) AS total_seats
  FROM
    shops s
  LEFT JOIN
    wishlist_items wi ON s.id = wi.cafe_id
  LEFT JOIN
    seats se ON s.id = se.cafe_id
  WHERE
    wi.wishlist_id = ?
  GROUP BY
    s.id, s.primary_image, s.address, s.opening_hour, s.min_order;`;
    try {
      const [result] = await pool.query(query, [wishlist_id]);
      return result;
    } finally {
      pool.releaseConnection();
    }
  },
  isWishlistExist: async (wishlist_id, customer_id) => {
    const query =
      'SELECT COUNT(*) AS count FROM wishlists WHERE id = ? AND customer_id = ?';
    try {
      const [result] = await pool.query(query, [wishlist_id, customer_id]);
      return result[0].count > 0;
    } finally {
      pool.releaseConnection();
    }
  },
  isCafeInWishlist: async (wishlist_id, cafe_id) => {
    const query =
      'SELECT COUNT(*) AS count FROM wishlist_items WHERE wishlist_id = ? AND cafe_id = ?';
    try {
      const [result] = await pool.query(query, [wishlist_id, cafe_id]);
      return result[0].count > 0;
    } finally {
      pool.releaseConnection();
    }
  },
  isCafeAddedByCustomer: async (customer_id, cafe_id) => {
    const query = `
      SELECT
        COUNT(*) AS count
      FROM
        wishlists AS w
      INNER JOIN
        wishlist_items AS wi ON w.id = wi.wishlist_id
      WHERE
        w.customer_id = ? AND wi.cafe_id = ?;
    `;
    try {
      const [result] = await pool.query(query, [customer_id, cafe_id]);
      return result[0].count == 1;
    } finally {
      pool.releaseConnection();
    }
  },
};
