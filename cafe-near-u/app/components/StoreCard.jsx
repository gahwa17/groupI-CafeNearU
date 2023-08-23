"use client";

import { Carousel, Dialog } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import Addwish from "./Like.jsx";
import Cookies from "js-cookie";

export default function StoreCard({ className, store }) {
  const cookieValue = Cookies.get("token");
  const {
    id,
    name,
    primary_image,
    wishlist_item,
    operating_status,
    min_order,
    seats,
  } = store;

  let seat = seats.some((elem) => elem.available_seats);
  const [liked, setLiked] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleLike = () => {
    setLiked(!liked); // 切换 liked 状态
    Cookies.set("storeid", id);
    // 根据 liked 状态决定是否打开对话框
    if (!liked) {
      handleOpen(); // 打开对话框
    } else {
      handleClose(); // 关闭对话框
    }
  };
  useEffect(() => {
    setLiked(wishlist_item);
    console.log(wishlist_item);
  }, []);

  const handleOpen = () => setOpen((cur) => !cur);

  // const handleClose = () => setOpen((cur) => !cur);
  const handleClose = async () => {
    const cafe = Cookies.get("storeid");
    const token = Cookies.get("token");
    console.log(id);
    // preventDefault();

    try {
      const requestData = {
        wishlist_id: String(id),
        cafe_id: String(cafe),
      };
      const response = await fetch(
        `https://13.211.10.154/api/1.0/wishlists/${id}/cafe/${cafe}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );
      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        console.log("把店家從心願單刪除成功");
      } else {
        console.error("把店家從心願單刪除失敗");
      }
    } catch (error) {
      console.error("把店家從心願單刪除發生錯誤:", error);
    }
  };

  return (
    <div className={`relative flex flex-col justify-center  ${className}`}>
      <Carousel transition={{ duration: 2 }}>
        <img
          src={primary_image}
          className="h-72 w-full md:w-72 object-cover rounded-xl"
        />
      </Carousel>
      <div className="text-2xl my-2 mt-4 text-gray-800">{name}</div>
      <div className="text-base text-gray-600 mb-4">{`${operating_status}  |  最低消費 $${min_order} | ${
        seat ? "尚有座位" : "座位已滿"
      }`}</div>
      {cookieValue && (
        <div
          className={"absolute top-2 right-5 cursor-pointer"}
          onClick={toggleLike}
          style={{ cursor: "pointer" }}
        >
          {liked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="red"
              className="h-7 w-7"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-red-500 stroke-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              />
            </svg>
          )}
        </div>
      )}
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Addwish />
      </Dialog>
    </div>
  );
}
