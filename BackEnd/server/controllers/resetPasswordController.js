const errorHandler = require('../util/errorHandler');
const { bcrypt, jwt, jwtSecret } = require('../util/common');
// const pool = require('../util/db');
const User = require('../models/customerModel');
const Redis = require('../util/redis');
const sendEmail = require('../util/sendEmail');

module.exports = {
  resetPasswordRequest: async (req, res) => {
    // 先拿到信箱
    const email = req.body.email;
    const isUserExist = await User.getByEmail(email);
    console.log('isUserExist:', isUserExist);
    // 檢查信箱對應的使用者存不存在
    if (!isUserExist) {
      return errorHandler.clientError(res, 'userNotFound');
    }
    // 若存在，把該user的ID記起來
    const userID = isUserExist.id;

    // 用 userID + jwt 產生臨時 token，記得 key 就用 userID，value
    const resetToken = jwt.sign(userID, jwtSecret);

    // 把臨時token存在redis，key就用reset-token#userID命名
    Redis.setCache(`reset-token#${userID}`, resetToken, 3600);

    // 產生重設密碼頁面的連結
    const link = `http://${process.env.HOST_NAME}/api/1.0/customers/reset-password?token=${resetToken}&user_id=${userID}`;

    // 送出信件
    const payload = {
      name: isUserExist.name,
      link: link,
    };

    const template = 'resetPassword';
    const subject = 'Cafe Near U 密碼重設連結';
    await sendEmail(email, subject, payload, template);

    const responseData = {
      message: `Suscessfully send reset link to ${email}`,
      data: {
        link: link,
        reset_token: resetToken,
      },
    };

    res.status(200).json(responseData);
  },
  resetPassword: async (req, res) => {
    const { user_id, reset_token, new_password } = req.body;

    // 去Redis查看是否有對應 user_id 的 resettoken (確認是否有執行重設密碼動作，且在期限內)
    const isResetTokenExist = await Redis.existsCache(`reset-token#${user_id}`);
    if (!isResetTokenExist) {
      return errorHandler.clientError(res, 'wrongResetToken');
    }
    try {
      jwt.verify(reset_token, jwtSecret);
    } catch (error) {
      errorHandler.clientError(res, 'wrongResetToken'), 403;
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await User.updatePassword(user_id, hashedPassword);

    const responseData = {
      message: 'Password reset successfully',
      data: {
        customer: {
          id: user_id,
        },
      },
    };

    res.status(200).json(responseData);
  },
};
