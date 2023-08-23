/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { withRouter } from "react-router-dom";

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

export default function Login() {
  const [activeButton, setActiveButton] = useState("guest");
  const [dialogOpen, setDialogOpen] = useState(true);
  const [url, seturl] = useState(
    "https://13.211.10.154/api/1.0/customers/signin"
  );
  const [type, settype] = useState(
    "https://13.211.10.154/api/1.0/customers/signin"
  );
  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };
  useEffect(() => {
    if (activeButton === "guest") {
      seturl("https://13.211.10.154/api/1.0/customers/signin");
    } else {
      seturl("https://13.211.10.154/api/1.0/shop-owners/signin");
    }
  }, [activeButton]);
  const loginValidationSchema = Yup.object().shape({
    email1: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password1: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must contain uppercase letter, lowercase letter, and number"
      ),
  });
  const formikLogin = useFormik({
    initialValues: {
      email1: "",
      password1: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      const { email1, password1 } = values;

      try {
        const loginResponse = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            provider: "native",
            email: String(email1),
            password: String(password1),
          }),
        });

        const loginData = await loginResponse.json();
        console.log(loginData);

        if (loginResponse.ok) {
          console.log("登入成功");
          document.cookie = `token=${loginData.data.access_token}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
          console.log(loginData.data.access_token);
          // 取得id
          // document.cookie = `userId=${loginData.data.${type}.id}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
          document.cookie = `userId=${loginData.data.customer.id}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
          //console.log(loginData.data.customer.id);
          window.location.reload();
        } else {
          console.error("註冊失敗:", data.error);
          if (response.status >= 500 && response.status <= 599) {
            alert("出現錯誤。請稍後再試或通知我們的工程團隊。");
            window.location.href = "/";
          } else {
            const errorMessage = `註冊失敗: ${data.error}`;
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
      {dialogOpen && (
        <Card className=" mx-auto">
          <div className="px-4 py-3 text-center font-bold text-xl text-[#030712]">
            登入
          </div>
          <hr className="border-gray-300" />

          <div className="container mx-auto flex items-center justify-start py-4">
            <p className="text-[#030712] text-xl ml-4 me-2 text-left font-logo">
              CafeNearU
            </p>
            <p className="text-[#030712] text-xl text-left font-inter me-4">
              歡迎你回來
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
          <form onSubmit={formikLogin.handleSubmit}>
            <CardBody className="flex flex-col gap-2">
              <Input
                type="email"
                id="email1"
                name="email1"
                {...formikLogin.getFieldProps("email1")}
                label="帳號"
                size="lg"
              />
              {formikLogin.touched.email1 && formikLogin.errors.email1 && (
                <p className="ml-2 text-red-500">{formikLogin.errors.email1}</p>
              )}
              <Input
                type="password"
                id="password1"
                name="password1"
                {...formikLogin.getFieldProps("password1")}
                label="密碼"
                size="lg"
              />
              {formikLogin.touched.password1 &&
                formikLogin.errors.password1 && (
                  <p className=" ml-2 text-red-500">
                    {formikLogin.errors.password1}
                  </p>
                )}
            </CardBody>

            <CardFooter className="pt-0 mt-8">
              <div className="flex justify-center items-center">
                <Button
                  type="submit"
                  className="bg-[#D0B8A8] px-6 py-2 text-lg"
                >
                  登入
                </Button>
              </div>

              <Typography variant="small" className="mt-6 flex justify-center">
                忘記密碼?
                <Typography
                  as="a"
                  href="#signup"
                  variant="small"
                  color="blue-gray"
                  className="ml-1 font-bold"
                >
                  點我
                </Typography>
              </Typography>
            </CardFooter>
          </form>
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
              <span className="flex-grow text-center">使用 Google 登入</span>
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
