/* eslint-disable no-unused-vars */
"use client";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  ButtonGroup,
} from "@material-tailwind/react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Wish from "../components/Wishitem.jsx";
import Comment from "../components/Comment.jsx";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

import useFetchWishlist from "../ApiHook/useFetchWishlist.jsx";

export default function h() {
  const [activeButton, setActiveButton] = useState(null);

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };
  const { userWishlist, fetchWishlist } = useFetchWishlist();
  useEffect(() => {
    fetchWishlist();
  }, []);

  const handletowishlist = (data) => {
    Cookies.set("wishlistid", data.id);
    Cookies.set("wishlistname", data.name);
    window.location.href = `/wishlists/${data.id}`;
  };

  return (
    <>
      <Header />
      <div className=" text-4xl mt-32 mb-4 ml-[10%] text-5c5c5c text-left font-bold font-normal">
        口袋名單
      </div>
      <hr className="border-gray-300 mb-20 " />
      <div className="ml-[10%] flex flex-wrap">
        {userWishlist.map((data) => (
          <div key={data.id} className={"md:w-[22%] w-[100%] p-4 "}>
            <>
              <Card
                className="w-[90%] mb-0 md:w-full h-[80%] transform hover:scale-110 transition-transform  border border-[#00000] shadow-ld cursor-pointer"
                onClick={() => handletowishlist(data)}
              >
                <CardHeader floated={false} className="shadow-md h-80">
                  <img
                    src={data.cover}
                    alt="profile-picture"
                    className="h-[100%] w-[100%]"
                  />
                </CardHeader>
                <CardBody className="text-center p-2">
                  <Typography
                    variant="h4"
                    color="blue-gray"
                    className="text-xl"
                  >
                    {data.name}
                  </Typography>
                </CardBody>
              </Card>
            </>
          </div>
        ))}
      </div>
      <Footer className="fixed bottom-0" />
    </>
  );
}
