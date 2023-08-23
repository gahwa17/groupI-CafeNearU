const pool = require('../util/db');

module.exports = {
  insertNewOwner: async (name, email, hashedPassword) => {
    const query =
      'INSERT INTO `shops` (user_name, email, password) VALUES (?, ?, ?)';
    try {
      return await pool.query(query, [name, email, hashedPassword]);
    } finally {
      pool.releaseConnection();
    }
  },
  getByEmail: async (email) => {
    const query = 'SELECT * FROM `shops` WHERE `email` = ?';
    try {
      const [result] = await pool.query(query, [email]);
      return result[0];
    } finally {
      pool.releaseConnection();
    }
  },
  getByID: async (id) => {
    const query = 'SELECT * FROM `shops` WHERE `id` = ?';
    try {
      const [result] = await pool.query(query, [id]);
      return result[0];
    } finally {
      pool.releaseConnection();
    }
  },
  updateProfile: async (currentID, name, email) => {
    const updateFields = [];
    const params = [];

    if (name) {
      updateFields.push('user_name = ?');
      params.push(name);
    }

    if (email) {
      updateFields.push('email = ?');
      params.push(email);
    }

    const query = `UPDATE shops SET ${updateFields.join(', ')} WHERE id = ?`;

    try {
      const [result] = await pool.query(query, [...params, currentID]);
      return result;
    } finally {
      pool.releaseConnection();
    }
  },
  updatePassword: async (currentID, hashedpassword) => {
    const query = 'UPDATE `shops` SET password = ? WHERE id = ?';
    try {
      const [result] = await pool.query(query, [hashedpassword, currentID]);
      return result[0];
    } finally {
      pool.releaseConnection();
    }
  },
  basicInfoUpdate: async (
    userId,
    basicInfoArr,
    rules,
    service_and_equipment,
  ) => {
    const insertBasicInfo = `UPDATE shops SET shop_name = ?, type = ?, nearest_MRT=?, introduction = ?, opening_hour = ?, closing_hour = ?, address = ?, telephone = ?, facebook = ?, ig = ?, line = ?, time_limit = ?, min_order = ?, plug = ?, wifi = ?, smoking_area = ?, cat = ?, dog = ?, primary_image = ?, secondary_image_1 = ?, secondary_image_2 = ?, rules = ?, service_and_equipment = ? WHERE id = ?`;
    try {
      await pool.query(insertBasicInfo, [
        ...basicInfoArr,
        rules,
        service_and_equipment,
        userId,
      ]);
    } finally {
      pool.releaseConnection();
    }
  },
  menuUpdate: async (userId, menu) => {
    const findMenu = `SELECT id FROM menus WHERE cafe_id = ?`;
    const deleteMenu = `DELETE FROM menus WHERE cafe_id = ?`;
    const insertMenu = `INSERT INTO menus (category, item, price, cafe_id) VALUES ?`;
    const recordUpdateTime = `UPDATE shops SET menu_last_updated = CONVERT_TZ(NOW(), 'UTC', 'Asia/Taipei') WHERE id = ?`;
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      const [hasMenu] = await conn.query(findMenu, userId);
      if (hasMenu.length !== 0) {
        await conn.query(deleteMenu, userId);
      }
      const menuArr = menu.map((item) => [
        item.category,
        item.item,
        item.price,
        userId,
      ]);
      await conn.query(insertMenu, [menuArr]);
      await conn.query(recordUpdateTime, [userId]);
      await conn.commit();
    } catch (error) {
      await conn.rollback();
    } finally {
      pool.releaseConnection();
    }
  },
  setSeatType: async (userId, seats) => {
    const findSeats = `SELECT id FROM seats WHERE cafe_id = ?`;
    const deleteSeats = `DELETE FROM seats WHERE cafe_id = ?`;
    const insertSeats = `INSERT INTO seats (icon, type, total_seats,cafe_id) VALUES ?`;
    try {
      const [hasSeats] = await pool.query(findSeats, userId);
      if (hasSeats.length !== 0) {
        await pool.query(deleteSeats, userId);
      }
      const seatTypeArr = seats.map((item) => [
        item.icon,
        item.type,
        item.total_seats,
        userId,
      ]);
      await pool.query(insertSeats, [seatTypeArr]);
    } finally {
      pool.releaseConnection();
    }
  },
  checkSeatSetting: async (userId, type) => {
    const findSeatSetting = `SELECT id FROM seats WHERE type = ? AND cafe_id = ?`;
    try {
      const [hasSeat] = await pool.query(findSeatSetting, [type, userId]);
      console.log(hasSeat);
      if (hasSeat.length === 0) {
        return 'Seat Not Found';
      }
    } finally {
      pool.releaseConnection();
    }
  },
  statusUpdate: async (userId, operating_status, type, available_seats) => {
    const updateSeatStatus = `UPDATE seats SET available_seats = ? WHERE type = ? AND cafe_id = ?`;
    const updateOperatingStatus = `UPDATE shops SET operating_status = ?, status_last_updated = (CONVERT_TZ(NOW(), 'UTC', 'Asia/Taipei')) WHERE id = ?`;
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    try {
      await conn.query(updateSeatStatus, [available_seats, type, userId]);
      await conn.query(updateOperatingStatus, [operating_status, userId]);
      await conn.commit();
    } catch (error) {
      await conn.rollback();
    } finally {
      pool.releaseConnection();
    }
  },
  isUnpub: async (userId) => {
    const query = `SELECT id FROM shops WHERE id = ? AND is_published = false`;
    try {
      const [[result]] = await pool.query(query, [userId]);
      return result;
    } finally {
      pool.releaseConnection();
    }
  },
  changeProfilePubStatus: async (userId, is_published) => {
    const updatePublishStatus = `UPDATE shops SET is_published = ? WHERE id = ?`;
    try {
      await pool.query(updatePublishStatus, [is_published, userId]);
    } finally {
      pool.releaseConnection();
    }
  },
  canBePublished: async (userId) => {
    const query = `select shop_name, menu_last_updated, status_last_updated from shops where id = ?;`;
    try {
      const [[result]] = await pool.query(query, [userId]);
      return result;
    } finally {
      pool.releaseConnection();
    }
  },
  getHistoryInput: async (userId) => {
    let query = `
      SELECT shops.id, shop_name, type, introduction, opening_hour, closing_hour, 
      primary_image, secondary_image_1, secondary_image_2, address, telephone, facebook, ig, line, 
      rules, service_and_equipment, 
      DATE_FORMAT(menu_last_updated, "%Y-%m-%d %H:%i:%s") AS menu_last_updated, 
      menus.category, 
      GROUP_CONCAT(CONCAT(menus.item, '$', menus.price)) AS menu_items
      FROM shops
      LEFT JOIN menus ON shops.id = menus.cafe_id
      WHERE shops.id = ? 
      GROUP BY shops.id, menus.category`;

    try {
      const [result] = await pool.query(query, userId);
      return result;
    } finally {
      await pool.releaseConnection();
    }
  },
};
