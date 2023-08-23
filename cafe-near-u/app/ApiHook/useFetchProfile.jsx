"use client";
import { useState } from "react";
import Cookies from "js-cookie";

const useFetchProfile = () => {
  const [userProfile, setUserProfile] = useState([]);

  const fetchProfile = async () => {
    try {
      const token = Cookies.get("token");
      const responseprofile = await fetch(
        `https://13.211.10.154/api/1.0/customers/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = await responseprofile.json();
      // console.log(responseData);

      if (responseprofile.ok) {
        console.log("獲取個人資料成功");
        const userProfiles = responseData.data.customer;
        setUserProfile(userProfiles);
        console.log(responseData);
        console.log(userProfile);
      } else {
        console.error("取得個人資料失敗");
      }
    } catch (error) {
      console.error("請求錯誤:", error);
    }
  };

  return { userProfile, fetchProfile };
};

export default useFetchProfile;
