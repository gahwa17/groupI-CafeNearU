/* eslint-disable no-unused-vars */
"use client";

import { IconButton, Switch, Button, Dialog } from "@material-tailwind/react";
import { useState, useEffect } from "react";

import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import Filter from "../../components/Filter.jsx";
import storesHome from "../../components/homepage/stores.js";
import StoreCard from "../../components/StoreCard.jsx";
import Cookies from "js-cookie";

export default function h() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const token = Cookies.get("token");

  // 獲取網址中的keyword 儲存到cookie
  const path = window.location.pathname;
  const parts = path.split("/"); // 将路径部分拆分成数组
  const keyword = parts[parts.length - 1];
  console.log(keyword); // 输出："台北"

  useEffect(() => {
    handleSearch();
  }, []);

  const [searchResult, setsearchResult] = useState([]);
  const handleSearch = async () => {
    try {
      // 向後端API發送請求，將輸入的搜索查詢作為參數傳遞
      const response = await fetch(
        `https://13.211.10.154/api/1.0/shops/search?${keyword}`,
        { next: { revalidate: 0 } },
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data.data.shops);

      if (response.ok) {
        console.log("關鍵字搜尋成功");

        const searchResults = data.data.shops;
        setsearchResult(searchResults);
      } else {
        console.error("關鍵字搜尋失敗");
      }
    } catch (error) {
      console.error("關鍵字搜尋，請求錯誤:", error);
    }
  };

  //點icon搜尋
  const [searchTerm, setSearchTerm] = useState("");
  const jump = (info) => {
    setSearchTerm(info);
    console.log(info);
    window.location.href = `/searchresult/${keyword + info}`;
  };

  return (
    <>
      <Header />
      <div id="categories" className="mx-[10%] justify-between flex flex-row">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />

        <div className="flex w-full items-end mt-24 gap-8 mb-3 flex-nowrap  ">
          <div className="flex mb-4 w-[60px] flex-col justify-center items-center relative">
            <IconButton variant="text" className="rounded-full">
              <span className="material-symbols-outlined">home</span>
            </IconButton>
            <span className="self-center text-xs lg:text-sm">我的搜尋</span>
          </div>

          <div className="h-full border-r border-gray-300 border-w-2 mb-1"></div>
          <div className="flex w-[70%] items-end gap-8 flex-nowrap overflow-scroll ">
            <div className="flex flex-col">
              <IconButton
                variant="text"
                className="rounded-full"
                onClick={() => {
                  jump("&type=工作");
                }}
              >
                <span className="material-symbols-outlined">work</span>
              </IconButton>
              <span className="self-center  text-xs lg:text-sm">工作</span>
            </div>
            <div className="flex flex-col">
              <IconButton
                variant="text"
                className="rounded-full"
                onClick={() => {
                  jump("&type=休閒");
                }}
              >
                <span className="material-symbols-outlined">local_cafe</span>
              </IconButton>
              <span className="self-center  text-xs lg:text-sm">休閒</span>
            </div>
            {/* <div className="flex flex-col">
              <IconButton variant="text" className="rounded-full">
                <span className="material-symbols-outlined">groups</span>
              </IconButton>
              <span className="self-center text-xs lg:text-sm">聚會</span>
            </div> */}
            <div className="flex flex-col">
              <IconButton
                variant="text"
                className="rounded-full"
                onClick={() => {
                  jump("&type=寵物");
                }}
              >
                <span className="material-symbols-outlined">pets</span>
              </IconButton>
              <span className="self-center  text-xs lg:text-sm">寵物</span>
            </div>
            <div className="flex flex-col">
              <IconButton
                variant="text"
                className="rounded-full"
                onClick={() => {
                  jump("&no_time_limit=true");
                }}
              >
                <span className="material-symbols-outlined">schedule</span>
              </IconButton>
              <span className="self-center text-xs lg:text-sm">不限時</span>
            </div>
            {/* <div className="flex flex-col">
              <IconButton variant="text" className="rounded-full">
                <span className="material-symbols-outlined">cookie</span>
              </IconButton>
              <span className="self-center  text-xs lg:text-sm">甜點</span>
            </div> */}
            <div className="flex flex-col">
              <IconButton
                variant="text"
                className="rounded-full"
                onClick={() => {
                  jump("&plug=true");
                }}
              >
                <span className="material-symbols-outlined">power</span>
              </IconButton>
              <span className="self-center  text-xs lg:text-sm">插座</span>
            </div>
            <div className="flex flex-col">
              <IconButton variant="text" className="rounded-full">
                <span className="material-symbols-outlined">casino</span>
              </IconButton>
              <span className="self-center text-xs lg:text-sm">好手氣</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleOpen}
          className="bg-[#D0B8A8] w-[15%] h-12 mt-28 hidden md:flex items-center justify-center space-x-2 font-bold text-white px-4 rounded-sm"
        >
          <img
            src="../sliders.png"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          />
          <span>篩選條件</span>
        </button>
      </div>
      <Dialog
        size="sm"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none "
      >
        <Filter />
      </Dialog>

      <hr className="border-gray-300 w-full" />
      <div className="flex w-full ">
        <div className="container w-[90%] mx-auto md:mx-[0%] md:w-[50%] md:ml-[10%] justify-between grid grid-cols-9 gap-8 mt-8">
          <div className=" h-8 flex justify-between items-center col-span-9 col-start-1  space-x-2">
            <span className="col-span-6 md:col-span-3 col-start-1 self-center text-xl md:text-2xl me-8">
              顯示23間咖啡廳
            </span>

            {/* <div className="w-[75%] col-span-2 col-start-3 relative flex items-center border-black border-2 rounded-full">
            <div className="self-center text-lg ml-4">低消價格</div>

            <Switch
              id="custom-switch-component"
              ripple={false}
              className="ml-1 h-full w-full checked:bg-[#D0B8A8]"
              containerProps={{
                className: "w-11 h-6",
              }}
              circleProps={{
                className: "ml-1 before:hidden left-0.5 border-none",
              }}
            />
          </div> */}

            <button
              onClick={handleOpen}
              className="bg-[#D0B8A8] md:hidden w-[30%] col-start-5 h-12  flex items-center justify-center space-x-2 font-bold text-white rounded-sm"
            >
              <img
                src="sliders.png"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              />
              <span>篩選條件</span>
            </button>
            <Button className="hidden md:flex md:col-span-2 md:col-start-7 bg-[#D0B8A8]  h-12 text-sm ">
              下一頁
            </Button>
          </div>

          <div className="col-span-9 md:hidden h-[300px] bg-gray-200 "></div>
          <div className="col-span-9 grid grid-cols-9 gap-4 justify-center">
            {searchResult.map((store) => (
              <StoreCard
                className={"rounded-xl col-span-9 md:col-span-3 "}
                key={store.id}
                store={store}
              />
            ))}
            {/* {storesHome.data.shops.leisure.map((store) => (
              <StoreCard
                className={"rounded-xl  col-span-6 lg:col-span-3"}
                key={store.id}
                store={store}
              />
            ))} */}
          </div>
        </div>
        <div className="hidden md:block w-[30%] h-[920px] bg-gray-200 "></div>
      </div>
      <Footer className="fixed bottom-0" />
    </>
  );
}
