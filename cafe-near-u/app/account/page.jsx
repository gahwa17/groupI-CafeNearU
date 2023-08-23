/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Login from "../components/Login.jsx";
import Header from "../components/Header.jsx";
import Signup from "../components/Signup.jsx";
import Footer from "../components/Footer.jsx";
import ChangePassword from "../components/ChangePassword.jsx";
import useFetchProfile from "../ApiHook/useFetchProfile.jsx";
import useProfileUpdate from "../ApiHook/useProfileUpdate.jsx";
import {
  Button,
  Dialog,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
} from "@material-tailwind/react";

export default function h() {
  const token = Cookies.get("token");
  // 獲取個人資料
  const { userProfile, fetchProfile } = useFetchProfile();
  useEffect(() => {
    fetchProfile();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [info, setInfo] = useState("");
  const [interest, setInterest] = useState("");
  const [password, setPassword] = useState("密碼");

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setInfo(userProfile.name);
    setInterest(userProfile.school);
  };

  const handleSaveClick = () => {
    setIsEditing(false); // 保存後，關閉編輯模式
  };

  const handleInfoChange = (e) => {
    setInfo(e.target.value);
  };

  const handleInterestChange = (e) => {
    setInterest(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const defaultImageSrc = "account_circle.svg"; // 替換為預設圖片的 URL

  // 上傳圖片
  const handleDrop = async (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      await uploadProfilePicture(file); // Upload the profile picture
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const uploadProfilePicture = async (pictureFile) => {
    const formData = new FormData();
    formData.append("picture", pictureFile);

    try {
      const response = await fetch(
        "https://13.211.10.154/api/1.0/customers/picture",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        fetchProfile();

        const data = await response.json();
        console.log("檔案上傳成功，圖片連結：", data.data.picture);
        // setUserImage(data.data.picture);
      }
      console.error("檔案上傳失敗");
    } catch (error) {
      console.error("請求錯誤:", error);
    }
  };

  const SaveProfile = () => {
    const { handleSaveProfile } = useProfileUpdate(
      info,
      interest,
      setIsEditing,
      fetchProfile
    );
    handleSaveProfile();
  };

  return (
    <>
      <Header />
      <div className="text-4xl mt-32 mb-4 ml-[10%] text-5c5c5c text-left font-bold font-normal">
        個人資料
      </div>

      <hr className="border-gray-300 mb-20 " />
      <div className="text-2xl mt-8 mb-4 ml-[10%] text-5c5c5c text-left font-bold ">
        編輯大頭貼
      </div>

      <div
        className="relative w-64 h-64 ml-[10%] mb-4 rounded-full overflow-hidden bg-white flex group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ cursor: "pointer" }}
      >
        <img
          src={userProfile.picture || defaultImageSrc}
          alt="User"
          width={180}
          height={180}
          className="w-64 h-64 object-cover"
        />

        {/* <div className="text-lg absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
          <p>拖曳於此編輯大頭貼</p>
        </div> */}
      </div>

      <div className="ml-[10%] w-[30%]">
        <div className="flex w-[100%] flex-col gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="text-xl font-bold">名稱</div>
              </div>
            </div>
            <div className="mb-4">
              {isEditing ? (
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none"
                  type="text"
                  value={info}
                  onChange={handleInfoChange}
                />
              ) : (
                <div className="border-b border-gray-300 text-gray-500">
                  {userProfile.name || info}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="text-xl font-bold">學校(可匿名)</div>
              </div>
            </div>
            <div>
              {isEditing ? (
                <input
                  className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none"
                  type="text"
                  value={interest}
                  onChange={handleInterestChange}
                />
              ) : (
                <div className="border-b border-gray-300 text-gray-500">
                  {userProfile.school || interest}
                </div>
              )}
            </div>

            {isEditing ? (
              <Button
                onClick={(handleSaveClick, SaveProfile)}
                variant="gradient"
                className="mt-4"
              >
                儲存個人資料
              </Button>
            ) : (
              <Button
                onClick={handleEditClick}
                variant="gradient"
                className="mt-4"
              >
                編輯個人資料
              </Button>
            )}

            <div className="flex items-center justify-between mt-4 mb-4">
              <div className="flex items-center">
                <div className="text-xl font-bold">帳號</div>
              </div>
            </div>
            <div>
              <div className="border-b border-gray-300 text-gray-500">
                {userProfile.email || info}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 mb-4">
              <div className="flex items-center">
                <div className="text-xl font-bold">密碼</div>
              </div>
            </div>
            <div>
              <div className="border-b border-gray-300 text-gray-500"></div>
            </div>
            <Button onClick={handleOpen} variant="gradient" className="mt-4">
              修改密碼
            </Button>
            {/* 要如何與背景一起消失 */}
            <Dialog size="xs" open={open} handler={handleOpen}>
              <ChangePassword />
            </Dialog>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
