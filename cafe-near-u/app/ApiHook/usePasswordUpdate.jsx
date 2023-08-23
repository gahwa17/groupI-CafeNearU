import { useState } from "react";
import Cookies from "js-cookie";

const useProfileUpdate = (info, interest, setIsEditing, fetchProfile) => {
  const handleSaveProfile = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        `https://13.211.10.154/api/1.0/customers/profile`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: info,
            school: interest,
          }),
        }
      );

      if (response.ok) {
        fetchProfile();
        console.log("用戶檔案更新成功");
        setIsEditing(false);
      } else {
        console.error("用戶檔案更新失敗");
      }
    } catch (error) {
      console.error("請求錯誤:", error);
    }
  };

  return {
    handleSaveProfile,
  };
};

export default useProfileUpdate;
