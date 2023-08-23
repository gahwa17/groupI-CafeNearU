// const nodemailer = require('nodemailer');
// const handlebars = require('handlebars');
// const fs = require('fs');

// const sendEmail = async (email, subject, payload, templatePath) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       service: 'Gmail',
//       port: 465,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const templateSource = fs.readFileSync(templatePath, 'utf8');
//     const compiledTemplate = handlebars.compile(templateSource);

//     const mailOptions = () => {
//       return {
//         from: process.env.EMAIL_USERNAME,
//         to: email,
//         subject: subject,
//         html: compiledTemplate(payload),
//       };
//     };

//     // Send email
//     transporter.sendMail(mailOptions(), (error, info) => {
//       if (error) {
//         console.log('Mail Error:', error);
//       } else {
//         console.log(`Suscessfully send reset link to ${email}`);
//       }
//     });
//   } catch (error) {
//     console.log('Mail Error:', error);
//   }
// };

// /*
// Example:
// sendEmail(
//   "youremail@gmail.com,
//   "Email subject",
//   { name: "Eze" },
//   "./templates/layouts/main.handlebars"
// );
// */

// module.exports = sendEmail;

const nodemailer = require('nodemailer');
const nodemailerExpressHandlebars = require('nodemailer-express-handlebars');
const path = require('path');

// 建立 nodemailer 的 transporter
const transporter = nodemailer.createTransport({
  // host: process.env.EMAIL_HOST,
  service: 'Gmail',
  port: 465,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 設定 Handlebars 的設定
const handlebarsOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: path.resolve(__dirname, 'template'), // 設定 Handlebars 模板目錄
    defaultLayout: false, // 不使用預設的 layout
  },
  viewPath: path.resolve(__dirname, 'template'), // 設定 Handlebars 模板目錄
  extName: '.handlebars',
};

// 設定 nodemailer 使用 nodemailer-express-handlebars
transporter.use('compile', nodemailerExpressHandlebars(handlebarsOptions));

// 匯出 sendEmail 函式
module.exports = async (email, subject, payload, template) => {
  try {
    const mailOptions = {
      from: `"CafeNearU咖啡廳地圖" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: subject,
      template: template, // 使用的 Handlebars 模板名稱，不需要副檔名
      context: payload, // 傳入 Handlebars 的資料
    };

    // 發送郵件
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.log('Mail Error:', error);
  }
};
