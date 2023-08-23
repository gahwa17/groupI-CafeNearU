"use client";

import { useState } from "react";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import { Dialog } from "@material-tailwind/react";
import Cookies from "js-cookie";

export default function withRouter(Header) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cookieValue = Cookies.get("token");

  const toggleMenu = () => {
    setIsMenuOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen((cur) => !cur);

  const [opensignup, setopensignup] = useState(false);
  const handleOpensignup = () => setopensignup((cur) => !cur);

  const handletowishlist = () => {
    window.location.href = "/wishlist";
  };

  const handletopersonal = () => {
    window.location.href = "/account";
  };

  const handleGoToHomePage = () => {
    window.location.href = "/";
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    // Cookies.remove("postid");
    window.location.href = "/"; // 登出後重定向至登入頁面
  };

  const [searchTerm, setSearchTerm] = useState(""); // 用户输入的搜索词

  const jump = (info) => {
    window.location.href = `/searchresult/${info}`;
  };
  return (
    <>
      <div className="fixed top-0 w-full h-[86px] flex-shrink-0 bg-white text-gray-600 text-center font-train-one font-normal flex justify-between items-center px-2 sm:px-4 border-d shadow-md z-[100]">
        <div
          className="ml-[5%] font-logo text-3xl md:text-4xl ml-10% text-5c5c5c text-center font-train-one font-normal cursor-pointer"
          onClick={handleGoToHomePage}
        >
          CafeNearU
        </div>
        <div className="relative flex items-center">
          <div className="absolute left-0 top-0 h-full flex items-center justify-center w-12">
            <img
              src="../search.svg"
              alt="Avatar"
              className="cursor: pointer w-6 h-6 text-gray-600"
              onClick={() => jump("keyword=" + searchTerm)}
            />
          </div>
          <input
            type="search"
            className="w-full h-11 px-4 pl-12 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg shadow-md"
            placeholder="開始搜尋"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            border="none"
          />
        </div>
        <div className="me-[5%] flex items-center">
          <div className="relative">
            <img
              src="../account_circle.svg"
              alt="main"
              className="w-12 h-12 rounded-full cursor-pointer"
              onMouseOver={toggleMenu}
            />
            {isMenuOpen && (
              <div
                className="absolute right-0 top-[50px] w-60 bg-white border border-gray-300 rounded-2xl shadow-lg"
                onMouseLeave={closeMenu}
              >
                {!cookieValue ? (
                  <ul className="">
                    <li
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-left font-bold text-xl first:hover:rounded-t-2xl last:hover:rounded-b-2xl"
                      onClick={handleOpen}
                    >
                      登入
                    </li>
                    <hr className="border-gray-300" />
                    <li
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-left font-bold text-xl"
                      onClick={handleOpensignup}
                    >
                      註冊
                    </li>
                    <hr className="border-gray-300" />
                  </ul>
                ) : (
                  <ul className="">
                    <li
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-left font-bold text-xl first:hover:rounded-t-2xl last:hover:rounded-b-2xl"
                      onClick={handletowishlist}
                    >
                      心願單
                    </li>
                    <hr className="border-gray-300" />
                    <li
                      className="px-4 py-3 hover-bg-gray-100 cursor-pointer text-left font-bold text-xl"
                      onClick={handletopersonal}
                    >
                      個人資料
                    </li>
                    <hr className="border-gray-300" />
                    <li
                      className="px-4 py-3 hover-bg-gray-100 cursor-pointer text-left text-xl"
                      onClick={handleLogout}
                    >
                      登出
                    </li>
                    <hr className="border-gray-300" />
                  </ul>
                )}
                <div className="text-gray-400 text-sm px-4 py-3 font-inter text-center text-lg font-logo">
                  CafeNearU
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
      >
        <Login />
      </Dialog>
      <Dialog
        size="sm"
        open={opensignup}
        handler={handleOpensignup}
        className="bg-transparent shadow-none"
      >
        <Signup />
      </Dialog>
    </>
  );
}
