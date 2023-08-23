/* eslint-disable no-unused-vars */
"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Login from "../Login.jsx";
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

export default function GuestSignupForm() {
  const registerValidationSchema = Yup.object().shape({
    name5: Yup.string().required("Name is required"),
    email5: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password5: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must contain uppercase letter, lowercase letter, and number"
      ),
    repassword5: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password5"), null], "Passwords must match"),
  });

  const formikRegister = useFormik({
    initialValues: {
      name5: "",
      email5: "",

      password5: "",
      repassword5: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      const { name5, email5, password5 } = values;
      console.log(name5);
      console.log(email5);
      console.log(password5);

      const requestData = {
        name: String(name5),

        email: String(email5),
        password: String(password5),
      };

      try {
        // 發送 API 請求進行註冊
        const response = await fetch(
          "https://13.211.10.154/api/1.0/shop-owners/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          }
        );

        const data = await response.json();

        if (response.ok) {
          console.log("店家註冊成功");
          console.log(data);
          window.location.reload();
          <Dialog
            size="xs"
            open={open}
            handler={handleOpen}
            className="bg-transparent shadow-none"
          >
            <Login />
          </Dialog>;
        } else {
          console.error("店家註冊失敗:", data.error);
          if (response.status >= 500 && response.status <= 599) {
            alert("出現錯誤。請稍後再試或通知我們的工程團隊。");
            window.location.href = "/";
          } else {
            const errorMessage = `店家註冊失敗: ${data.error}`;
            alert(errorMessage);
            window.location.href = "/";
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
      <form onSubmit={formikRegister.handleSubmit}>
        <CardBody className="flex flex-col gap-4">
          <div className="mb-4">
            <Input
              type="text"
              id="name5"
              name="name5"
              {...formikRegister.getFieldProps("name5")}
              label="店家名稱"
              size="lg"
            />

            {formikRegister.touched.name5 && formikRegister.errors.name5 && (
              <p className="ml-2 text-red-500">
                {" "}
                {formikRegister.errors.name5}
              </p>
            )}
          </div>
          <div className="mb-4">
            <Input
              type="email"
              id="email5"
              name="email5"
              {...formikRegister.getFieldProps("email5")}
              label="帳號"
              size="lg"
            />
            {formikRegister.touched.email5 && formikRegister.errors.email5 && (
              <p className="ml-2 text-red-500">
                {formikRegister.errors.email5}
              </p>
            )}
          </div>
          <div className="mb-4">
            <Input
              type="password"
              id="password5"
              name="password5"
              label="密碼"
              size="lg"
              {...formikRegister.getFieldProps("password5")}
            />
            {formikRegister.touched.password5 &&
              formikRegister.errors.password5 && (
                <p className="ml-2 text-red-500">
                  {formikRegister.errors.password5}
                </p>
              )}
          </div>
          <div className="mb-2">
            <Input
              type="password"
              id="repassword5"
              name="repassword5"
              {...formikRegister.getFieldProps("repassword5")}
              label="確認密碼"
              size="lg"
            />
            {formikRegister.touched.repassword5 &&
              formikRegister.errors.repassword5 && (
                <p className="ml-2 text-red-500">
                  {formikRegister.errors.repassword5}
                </p>
              )}
          </div>
        </CardBody>

        <CardFooter className="pt-0">
          <div className="flex justify-center items-center ">
            <Button type="submit" className="bg-[#D0B8A8] px-6 py-2 text-lg">
              註冊
            </Button>
          </div>
        </CardFooter>
      </form>
    </>
  );
}
