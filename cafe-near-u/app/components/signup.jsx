/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Login from "./Login.jsx";
import GuestSignupForm from "./signupform/GuestSignupForm.jsx";
import StoreSingupForm from "./signupform/StoreSingupForm.jsx";
import { Card, Button, ButtonGroup } from "@material-tailwind/react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [activeButton, setActiveButton] = useState("guest");
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };

  return (
    <>
      {dialogOpen && (
        <Card className="w-full mx-auto ">
          <div className="px-4 py-3 text-center font-bold text-xl text-[#030712] ">
            註冊
          </div>
          <hr className="border-gray-300" />

          <div className="container mx-auto flex items-center justify-start py-4">
            <p className="text-[#030712] text-xl ml-4 me-2 text-left font-logo">
              CafeNearU
            </p>
            <p className="text-[#030712] text-xl text-left font-inter me-4">
              歡迎你
            </p>
            <ButtonGroup
              variant="outlined"
              size="sm"
              className="flex items-center"
            >
              <Button
                className={`${
                  activeButton === "guest" ? "bg-black text-white" : ""
                } hover:bg-black hover:text-white`}
                onClick={() => handleButtonClick("guest")}
              >
                客人
              </Button>
              <Button
                className={`${
                  activeButton === "store" ? "bg-black text-white" : ""
                } hover:bg-black hover:text-white`}
                onClick={() => handleButtonClick("store")}
              >
                店家
              </Button>
            </ButtonGroup>
          </div>
          {activeButton === "guest" && <GuestSignupForm />}
          {activeButton === "store" && <StoreSingupForm />}
          <div className="flex items-center justify-center">
            <hr className="mt-4 border-gray-300 flex-grow" />
            <div className="flex items-center">
              <p className="text-[#030712] text-sm mt-2 mx-4">或</p>
            </div>
            <hr className="mt-4 border-gray-300 flex-grow" />
          </div>
          <div className="flex items-center justify-center mt-4 mb-4">
            <Button
              size="md"
              variant="outlined"
              color="#030712"
              className="flex items-center gap-3 w-80 mb-4 items-center text-left"
            >
              <img src="images.png" alt="metamask" className="h-6 w-6" />
              <span className="flex-grow text-center">使用 Google 註冊</span>
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
