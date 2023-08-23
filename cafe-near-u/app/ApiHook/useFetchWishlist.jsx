import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useFetchWishlist = () => {
  const [userWishlist, setuserWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const token = Cookies.get("token");
      const id = Cookies.get("userId");
      const responseprofile = await fetch(
        `https://13.211.10.154/api/1.0/wishlists/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await responseprofile.json();
      // console.log(responseData);

      if (responseprofile.ok) {
        console.log("獲取心願單成功");
        const userWishlists = responseData.data.wishlists;
        setuserWishlist(userWishlists);
        console.log(responseData);
        console.log(userWishlist);
      } else {
        console.error("獲取心願單失敗");
      }
    } catch (error) {
      console.error("請求錯誤:", error);
    }
  };

  return { userWishlist, fetchWishlist };
};

export default useFetchWishlist;
