"use client";
import { useState } from "react";
import Cookies from "js-cookie";

const useFetchHomepage = () => {
  const [homepage, sethomepage] = useState([]);

  const fetchHomepage = async () => {
    try {
      const token = Cookies.get("token");
      const responseprofile = await fetch(
        `https://13.211.10.154/api/1.0/home`,
        {
          method: "GET",
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );
      const responseData = await responseprofile.json();
      // console.log(responseData);

      if (responseprofile.ok) {
        console.log("獲取首頁成功");
        const homepages = responseData.data.shops;
        sethomepage(homepages);
        console.log(responseData);
        console.log("homepage");
        console.log(homepages);
      } else {
        console.error("取得首頁失敗");
      }
    } catch (error) {
      console.error("取得首頁請求錯誤:", error);
    }
  };

  return { homepage, fetchHomepage };
};

export default useFetchHomepage;
