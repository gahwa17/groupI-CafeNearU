/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import Addwish from "./Like.jsx";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Button,
  ButtonGroup,
  Dialog,
} from "@material-tailwind/react";

export default function Addtowishlist({ handleOpen }) {
  const [open2, setOpen] = useState(false);
  const handleOpen2 = () => setOpen((cur) => !cur);
  const token = Cookies.get("token");
  const [wish, setWish] = useState("");

  const handleChange = (e) => {
    setWish(e.target.value);
  };
  const handleCreate = async (event) => {
    event.preventDefault();
    console.log(wish);
    try {
      const requestData = {
        wishlist_name: String(wish),
      };
      const response = await fetch(`https://13.211.10.154/api/1.0/wishlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        console.log("新增心願單成功");
        handleOpen();
        <Dialog
          size="xs"
          open={open2}
          handler={handleOpen2}
          className="bg-transparent shadow-none"
        >
          <Addwish />
        </Dialog>;
      } else {
        console.error("新增心願單失败");
      }
    } catch (error) {
      console.error("新增心願單發生錯誤:", error);
    }
  };

  return (
    <>
      <Card className=" mx-auto">
        <div className="px-4 py-3 text-center font-bold text-xl text-[#030712]">
          建立新的心願單
        </div>
        <hr className="border-gray-300" />

        <div className="container mx-auto flex items-center justify-start py-4">
          <p className="text-[#030712] text-xl ml-4 me-2 text-left font-logo">
            CafeNearU
          </p>
          <p className="text-[#030712] text-xl text-left font-inter me-4">
            也喜歡你呦~
          </p>
        </div>

        <form onSubmit={handleCreate}>
          <CardBody className="flex flex-col gap-2">
            <Input
              type="text"
              id="wish"
              name="wish"
              label="心願單名稱"
              size="lg"
              onChange={handleChange}
            />
          </CardBody>

          <CardFooter className="pt-0 mt-4">
            <div className="flex justify-center items-center">
              <Button type="submit" className="bg-[#D0B8A8] px-6 py-2 text-lg">
                新增心願單
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
