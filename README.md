# CafeNearU 咖啡廳地圖

CafeNearU 是一個咖啡廳地圖的協作專案，旨在「終結咖啡廳選擇困難症」，幫助用戶輕鬆查找附近的咖啡廳、查看詳細資訊，並享受完善的篩選機制和定制的評價系統。

![圖片](https://github.com/gahwa17/groupI-CafeNearU/assets/52663020/240a1ed9-7b10-41a0-a3f2-9bd6704aa79a)

## 動機

我們透過大學生的訪談，深入了解使用咖啡廳的需求和挑戰。我們發現：

- 大學生常常選擇咖啡廳作為學習、工作和放鬆的場所。
- 面對咖啡廳眾多的選擇，資訊分散，使用者容易因此遭遇選擇困難。
- 咖啡廳的座位安排、服務與設施、評價等資訊不夠清晰，使用者經常遇到不理想的體驗。

為解決這些問題，我們創建了 CafeNearU 咖啡廳地圖專案，致力於提供：

- 強大且易用的篩選機制，幫助使用者快速找到合適的咖啡廳。
- 完整且即時的店家資訊整理，包括特色、營業時間、菜單、限制條件等。
- 定制的評價系統，幫助使用者更準確地評估咖啡廳。

## 功能特色

- **規格化整理**
    - 咖啡廳地圖查詢
    - 咖啡廳詳細資訊，包括店家主打特色和鄰近捷運站等等
    - 即時店況，提供一週的營業時間和當日營業狀況
 
    ![圖片](https://github.com/gahwa17/groupI-CafeNearU/assets/52663020/e64a8819-b872-4765-b69e-1701442df2ee)

- **收藏功能**
    - 咖啡廳許願清單，幫助使用者管理喜愛的咖啡廳
- **條件篩選**
    - 根據「種類」、「低消」、「設備與服務」等條件，篩選最理想的咖啡廳

    ![圖片](https://github.com/gahwa17/groupI-CafeNearU/assets/52663020/9a619d52-2ef8-4bfc-a705-8181df670ad9)

- **評論功能**
    - 提供整體評論和針對咖啡廳設計的評分項目，幫助使用者做出明智選擇

   ![圖片](https://github.com/gahwa17/groupI-CafeNearU/assets/52663020/be8416c6-b27e-4e02-bf5c-de8802283ffd)
  
- **會員店家註冊與登入**
    - 提供店家後臺頁面管理，以及重設密碼信箱驗證功能

    ![圖片](https://github.com/gahwa17/groupI-CafeNearU/assets/52663020/b7c7ab8e-a07f-4fe4-9ad5-33703fba23f3)

## 系統架構圖
![圖片](https://github.com/gahwa17/groupI-CafeNearU/assets/52663020/5a914fb0-ea5d-490d-87ab-cf797a7624f0)


## 如何啟用
1. 安裝套件： `npm install`
2. 啟動 MySQL 伺服器
3. 匯入資料庫： `mysql -u <user_name> -p <cafe_near_u> < cafe_near_u.sql`
4. 建立設定檔案： `.env` （可參考範本 `.env-template` 架構）
   1. 設定 `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` 用於 MySQL 伺服器
   2. 設定 `JWT_SECRET` 用於 JWT
   3. 設定 `DISCORD_BOT_TOKEN`, `DISCORD_SERVER_ID`, `DISCORD_CHANNEL_ID`, `DISCORD_WEBHOOK_URL` 用於 Discord 機器人
   4. 設定 `EMAIL_USERNAME`, `EMAIL_PASSWORD` 用於信箱驗證
5. 啟動伺服器： `nodemon app.js`

## 技術與負責項目
- **後端**：Node.js, Express.js
- **部署** : AWS EC2
- **資料庫**：AWS RDS (MySQL)
- **重點功能**：
  - redis, nodemail, handlebar: 信箱驗證遺忘密碼功能
  - 進階MySQL語法 CTE, JOIN: 定期更新咖啡廳綜合評分
- **開發流程**: scrum
