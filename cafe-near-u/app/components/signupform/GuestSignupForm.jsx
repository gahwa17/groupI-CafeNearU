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
  const [username, setUsername] = useState("");
  const [activeButton, setActiveButton] = useState("guest");
  const [dialogOpen, setDialogOpen] = useState(true);

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };
  //客人註冊
  const registerValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    school: Yup.string().required("School is required"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must contain uppercase letter, lowercase letter, and number"
      ),
    repassword: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const formikRegister = useFormik({
    initialValues: {
      name: "",
      email: "",
      school: "",
      password: "",
      repassword: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      const { name, email, school, password } = values;
      console.log(name);
      console.log(school);
      console.log(email);
      console.log(password);

      const requestData = {
        name: String(name),
        email: String(email),
        password: String(password),
        school: String(school),
      };

      try {
        // 發送 API 請求進行註冊
        const response = await fetch(
          "https://13.211.10.154/api/1.0/customers/signup",
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
          console.log("註冊成功");
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
      <form onSubmit={formikRegister.handleSubmit}>
        <CardBody className="flex flex-col gap-4">
          <div className="mb-4">
            <Input
              type="text"
              id="name"
              name="name"
              {...formikRegister.getFieldProps("name")}
              label="名稱"
              size="lg"
            />

            {formikRegister.touched.name && formikRegister.errors.name && (
              <p className="ml-2 text-red-500">{formikRegister.errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <Input
              type="text"
              id="school"
              name="shcool"
              {...formikRegister.getFieldProps("school")}
              label="學校(可匿名)"
              size="lg"
            />{" "}
            {formikRegister.touched.school && formikRegister.errors.school && (
              <p className="ml-2 text-red-500">
                {formikRegister.errors.school}
              </p>
            )}
          </div>
          <div className="mb-4">
            <Input
              type="email"
              id="email"
              name="email"
              {...formikRegister.getFieldProps("email")}
              label="帳號"
              size="lg"
            />
            {formikRegister.touched.email && formikRegister.errors.email && (
              <p className="ml-2 text-red-500">{formikRegister.errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <Input
              type="password"
              id="password"
              name="password"
              label="密碼"
              size="lg"
              {...formikRegister.getFieldProps("password")}
            />
            {formikRegister.touched.password &&
              formikRegister.errors.password && (
                <p className="ml-2 text-red-500">
                  {formikRegister.errors.password}
                </p>
              )}
          </div>
          <div className="mb-4">
            <Input
              type="password"
              id="repassword"
              name="repassword"
              {...formikRegister.getFieldProps("repassword")}
              label="確認密碼"
              size="lg"
            />
            {formikRegister.touched.repassword &&
              formikRegister.errors.repassword && (
                <p className="ml-2 text-red-500">
                  {formikRegister.errors.repassword}
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
