"use client";
import { useState } from "react";
import Cookies from "js-cookie";

const userWishlistitem = () => {
  const [userWishlistitem, setuserWishlistitem] = useState([]);

  const fetchWishlistitem = async () => {
    try {
      const token = Cookies.get("token");
      const id = Cookies.get("wishlistid");
      const responseprofile = await fetch(
        `https://13.211.10.154/api/1.0/wishlists/${id}/cafe`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await responseprofile.json();
      // console.log(responseData);

      if (responseprofile.ok) {
        console.log("獲取心願單內容成功");
        const userWishlists = responseData.data.shops;
        setuserWishlistitem(userWishlists);
        console.log(responseData);
        console.log(userWishlistitem);
      } else {
        console.error("獲取心願單內容失敗");
      }
    } catch (error) {
      console.error("請求錯誤:", error);
    }
  };

  return { userWishlistitem, fetchWishlistitem };
};

export default userWishlistitem;
