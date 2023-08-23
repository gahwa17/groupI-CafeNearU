"use client";

import { useState, useEffect } from "react";
import storesHome from "./components/homepage/stores";
import Header from "./components/Header";
import { IconButton } from "@material-tailwind/react";
import StoreCard from "./components/StoreCard";
import Footer from "./components/Footer";
import useFetchHomepage from "./ApiHook/useFetchHomepage.jsx";

export default function Home() {
  console.log(storesHome);

  //點icon搜尋
  const [searchTerm, setSearchTerm] = useState("");
  const jump = (info) => {
    setSearchTerm(info);
    console.log(info);
    window.location.href = `/searchresult/${info}`;
  };
  const { homepage, fetchHomepage } = useFetchHomepage();
  useEffect(() => {
    fetchHomepage();
  }, []);

  return (
    <>
      <Header />
      <div className="relative isolate px-6 pt-10 lg:px-8 ">
        <div className="mx-auto max-w-2xl py-28 sm:py-32 lg:py-48">
          <div className="text-center">
            <h1 className="text-4xl font-thin tracking-tight text-gray-900 sm:text-6xl">
              Sip, Search, Savor.
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 font-light">
              Exploring Cafés Near You
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#categories"
                className="rounded-md bg-[#b69e8e] px-3.5 py-2.5 text-base font-light text-white shadow-sm hover:bg-[#D0B8A8] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                開始探索各式咖啡廳
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto h-[0.7px] bg-gray-400"></div>
      <div
        id="categories"
        className="container mx-auto flex flex-row justify-center "
      >
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
        />

        <div className="flex items-end gap-8 mt-4 flex-nowrap overflow-scroll ">
          <div className="flex flex-col">
            <IconButton
              variant="text"
              className="rounded-full"
              onClick={() => {
                jump("type=工作");
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
                jump("type=休閒");
              }}
            >
              <span className="material-symbols-outlined">local_cafe</span>
            </IconButton>
            <span className="self-center  text-xs lg:text-sm">休閒</span>
          </div>
          {/* <div className="flex flex-col">
            <IconButton variant="text" className="rounded-full">
              <span class="material-symbols-outlined">groups</span>
            </IconButton>
            <span className="self-center text-xs lg:text-sm">聚會</span>
          </div> */}
          <div className="flex flex-col">
            <IconButton
              variant="text"
              className="rounded-full"
              onClick={() => {
                jump("type=寵物");
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
                jump("no_time_limit=true");
              }}
            >
              <span className="material-symbols-outlined">schedule</span>
            </IconButton>
            <span className="self-center text-xs lg:text-sm">不限時</span>
          </div>
          {/* <div className="flex flex-col">
            <IconButton variant="text" className="rounded-full">
              <span class="material-symbols-outlined">cookie</span>
            </IconButton>
            <span className="self-center  text-xs lg:text-sm">甜點</span>
          </div> */}
          <div className="flex flex-col">
            <IconButton
              variant="text"
              className="rounded-full"
              onClick={() => {
                jump("plug=true");
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
      <div className="container mx-auto grid grid-cols-12 gap-8 mt-8">
        <div className="col-span-12 text-2xl font-light text-gray-800">
          精選工作地點
        </div>
        <div className="col-span-12 grid grid-cols-12 gap-8">
          {homepage.workspace?.map((store) => (
            <StoreCard
              className={"rounded-xl col-span-6 lg:col-span-3"}
              key={store.id}
              store={store}
            />
          ))}
        </div>
        <div className="col-span-12 text-2xl font-light text-gray-800">
          精選放鬆地點
        </div>
        <div className="col-span-12 grid grid-cols-12 gap-8">
          {homepage.leisure?.map((store) => (
            <StoreCard
              className={"rounded-xl  col-span-6 lg:col-span-3"}
              key={store.id}
              store={store}
            />
          ))}
        </div>
        <div className="col-span-12 text-2xl font-light text-gray-800">
          擼貓擼狗好去處
        </div>
        <div className="col-span-12 grid grid-cols-12 gap-8">
          {homepage.pet?.map((store) => (
            <StoreCard
              className={"rounded-xl  col-span-6 lg:col-span-3"}
              key={store.id}
              store={store}
            />
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
