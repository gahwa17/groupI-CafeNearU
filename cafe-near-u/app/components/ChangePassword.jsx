/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import Login from "./Login.jsx";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
  ButtonGroup,
} from "@material-tailwind/react";

export default function ChangePassword() {
  const token = Cookies.get("token");
  const [username, setUsername] = useState("");
  const [activeButton, setActiveButton] = useState("guest");
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };
  //註冊
  const registerValidationSchema = Yup.object().shape({
    password3: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must contain uppercase letter, lowercase letter, and number"
      ),
    repassword3: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password3"), null], "Passwords must match"),
  });

  const formikRegister = useFormik({
    initialValues: {
      password3: "",
      repassword3: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      const { password3 } = values;

      console.log(password3);

      const requestData = {
        new_password: String(password3),
      };

      try {
        // 發送 API 請求進行註冊
        const response = await fetch(
          "https://13.211.10.154/api/1.0/customers/update-password",
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("修改密碼成功");
          console.log(data);
          setDialogOpen(false);
        } else {
          console.error("修改密碼失敗:", data.error);
          if (response.status >= 500 && response.status <= 599) {
            alert("出現錯誤。請稍後再試或通知我們的工程團隊。");
          } else {
            const errorMessage = `修改密碼失敗: ${data.error}`;
            alert(errorMessage);
          }
        }
      } catch (error) {
        // 處理請求錯誤
        console.error("請求錯誤:", error);
      }
    },
  });

  return (
    <>
      {dialogOpen && (
        <Card className=" mx-auto">
          <div className="px-4 py-3 text-center font-bold text-xl text-[#030712]">
            修改密碼
          </div>
          <hr className="border-gray-300" />

          <div className="container mx-auto flex items-center justify-start py-4">
            <p className="text-[#030712] text-xl ml-4 me-2 text-left font-logo">
              CafeNearU
            </p>
            <p className="text-[#030712] text-xl text-left font-inter me-4">
              提醒您要記得寫下來呦~
            </p>
          </div>
          <form onSubmit={formikRegister.handleSubmit}>
            <CardBody className="flex flex-col gap-4">
              <Input
                type="password"
                id="password3"
                name="password3"
                label="新密碼"
                size="lg"
                {...formikRegister.getFieldProps("password3")}
              />
              {formikRegister.touched.password3 &&
                formikRegister.errors.password3 && (
                  <p className="ml-2 text-red-500">
                    {formikRegister.errors.password3}
                  </p>
                )}
              <Input
                type="password"
                id="repassword3"
                name="repassword3"
                {...formikRegister.getFieldProps("repassword3")}
                label="確認密碼"
                size="lg"
              />
              {formikRegister.touched.repassword3 &&
                formikRegister.errors.repassword3 && (
                  <p className="ml-2 text-red-500">
                    {formikRegister.errors.repassword3}
                  </p>
                )}
            </CardBody>

            <CardFooter className="pt-0 mt-8">
              <div className="flex justify-center items-center">
                <Button
                  type="submit"
                  className="bg-[#D0B8A8] px-6 py-2 text-lg"
                >
                  送出密碼
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      )}
    </>
  );
}
