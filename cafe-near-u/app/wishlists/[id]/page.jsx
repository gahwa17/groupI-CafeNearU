/* eslint-disable no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import storesHome from "../../components/homepage/stores.js";
import StoreCard from "../../components/StoreCard.jsx";
import useWishlistitem from "../../ApiHook/userWishlistitem.jsx";

export default function h() {
  const [activeButton, setActiveButton] = useState(null);
  const name = Cookies.get("wishlistname");

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  const { userWishlistitem, fetchWishlistitem } = useWishlistitem();

  useEffect(() => {
    fetchWishlistitem();
  }, []);
  return (
    <>
      <Header />
      <div className=" text-4xl mt-32 mb-4 ml-[10%] text-5c5c5c text-left font-bold font-normal">
        {name}
      </div>
      <hr className="border-gray-300 mb-20 " />
      <div className="container mx-auto grid grid-cols-12 gap-8 mt-8">
        <div className="col-span-12 grid grid-cols-12 gap-8">
          {userWishlistitem.map((store) => (
            <StoreCard
              className={"rounded-xl col-span-6 lg:col-span-3"}
              key={store.id}
              store={store}
            />
          ))}
        </div>
      </div>

      <Footer className="fixed bottom-0" />
    </>
  );
}
