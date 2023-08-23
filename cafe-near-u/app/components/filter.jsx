/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";

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
  Slider,
} from "@material-tailwind/react";

export default function Filter() {
  const [username, setUsername] = useState("");
  const [activeButton, setActiveButton] = useState("all");
  const [picButton, setpicButton] = useState("cafe.gif");
  const [defiButton, setdefiButton] = useState("就知道你什麼都喜歡");

  const [activeButton2, setActiveButton2] = useState("alltime");
  const handleButtonClick2 = (buttonType) => {
    setActiveButton2(buttonType);
  };

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  };
  const [sliderValue, setSliderValue] = useState(50);

  const handleSliderChange = (value) => {
    setSliderValue(value);
  };
  // 獲取網址中的keyword 儲存到cookie
  const path = window.location.pathname;
  const match = path.match(/keyword=([^&]*)/);
  const keyword = match[0];
  console.log(keyword); // 输出："台北"

  const [type, settype] = useState("");
  const [plug, setplug] = useState("");
  const [wifi, setwifi] = useState("");
  const [dog, setdog] = useState("");
  const [cat, setcat] = useState("");
  const [smoke, setsmoke] = useState("");
  const [money, setmoney] = useState("");
  const [timelimit, settimelimit] = useState("");

  // checkbox
  const [plugChecked, setplugChecked] = useState(false);
  const [wifiChecked, setWifiChecked] = useState(false);
  const [dogChecked, setDogChecked] = useState(false);
  const [catChecked, setCatChecked] = useState(false);
  const [smokingAreaChecked, setSmokingAreaChecked] = useState(false);

  const handlePlugChange = (e) => {
    setplugChecked(e.target.checked);
    if (e.target.checked) {
      setplug("&plug=true");
    } else {
      setplug("");
    }
  };

  const handleWifiChange = (e) => {
    setWifiChecked(e.target.checked);
    if (e.target.checked) {
      setwifi("&wifi=true");
    } else {
      setwifi("");
    }
  };

  const handleDogChange = (e) => {
    setDogChecked(e.target.checked);
    if (e.target.checked) {
      setdog("&dog=true");
    } else {
      setdog("");
    }
  };

  const handleCatChange = (e) => {
    setCatChecked(e.target.checked);

    if (e.target.checked) {
      setcat("&cat=true");
    } else {
      setcat("");
    }
  };

  const handleSmokingAreaChange = (e) => {
    setSmokingAreaChecked(e.target.checked);

    if (e.target.checked) {
      setsmoke("&smoking_area=true");
    } else {
      setsmoke("");
    }
  };
  const [searchTerm, setSearchTerm] = useState(""); // 用户输入的搜索词
  const [all, setall] = useState("");
  useEffect(() => {
    const updatedAll =
      keyword + type + plug + wifi + dog + cat + smoke + money + timelimit;
    setall(updatedAll);
    console.log(all);
  }, [type, plug, wifi, dog, cat, smoke, money, timelimit]);

  const showresult = () => {
    if (searchTerm === "") {
      setmoney("");
    } else {
      setmoney("&min_order=" + searchTerm);
    }

    // const updatedAll =
    //   keyword + type + plug + wifi + dog + cat + smoke + money + timelimit;
    // setall(updatedAll);
  };

  const jump = (all) => {
    window.location.href = `/searchresult/${all}`;
  };

  // 清除狀態
  const resetFilters = () => {
    // 清除其他状态
  };
  return (
    <>
      <Card className="w-full">
        <div className="px-4 py-3 text-center font-bold text-xl text-[#030712]">
          篩選條件
        </div>
        <hr className="border-gray-300" />

        <div className="container mx-auto flex-row items-center justify-start py-4">
          <p className="text-[#030712] text-xl ml-8 me-2 mb-4 text-left font-bold">
            咖啡廳類型
          </p>
          <div className="ml-8 me-8 flex flex-col md:flex-row items-center">
            <div className="flex-col w-full md:w-[60%]">
              <img
                src={picButton}
                alt="cafe"
                className=" md:hidden block mb-4 w-[60%] md:w-[40%] h-28 text-gray-600 md:mt-0"
              />
              <ButtonGroup
                variant="outlined"
                size="lg"
                className="flex items-center"
              >
                <Button
                  className={`${activeButton === "all" ? "bg-[#D0B8A8]" : ""}`}
                  onClick={() => {
                    handleButtonClick("all");
                    setpicButton("../cafe.gif");
                    setdefiButton("就知道你什麼都喜歡");
                    settype("");
                  }}
                >
                  所有
                </Button>
                <Button
                  className={`${activeButton === "work" ? "bg-[#D0B8A8]" : ""}`}
                  onClick={() => {
                    handleButtonClick("work");
                    setpicButton("../working.gif");
                    setdefiButton("工作的定義");
                    settype("&type=工作");
                  }}
                >
                  工作
                </Button>
                <Button
                  className={`${activeButton === "free" ? "bg-[#D0B8A8]" : ""}`}
                  onClick={() => {
                    handleButtonClick("free");
                    setpicButton("../tea.gif");
                    setdefiButton("舒服的放鬆");
                    settype("&type=休閒");
                  }}
                >
                  休閒
                </Button>
                <Button
                  className={`${
                    activeButton === "gather" ? "bg-[#D0B8A8]" : ""
                  }`}
                  onClick={() => {
                    handleButtonClick("gather");
                    setpicButton("../cat.gif");
                    setdefiButton("貓咪好療癒");
                    settype("&type=寵物");
                  }}
                >
                  寵物
                </Button>
              </ButtonGroup>
              <p className="text-[#030712] text-md mt-1 ml-4 mb-2 text-left">
                {defiButton}
              </p>
            </div>
            <img
              src={picButton}
              alt="cafe"
              className=" hidden md:block w-full md:w-[40%] h-28 text-gray-600 md:mt-0"
            />
          </div>
        </div>

        <hr className="border-gray-300 w-11/12 mx-auto" />

        <div className="container w-[100%] mx-auto flex-row items-center justify-start ml-8 py-4">
          <p className="text-[#030712] text-xl me-2 mb-2 text-left font-bold">
            設備與服務
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Checkbox
              label="有插座"
              checked={plugChecked}
              onChange={handlePlugChange}
            />
            <Checkbox
              label="WIFI"
              checked={wifiChecked}
              onChange={handleWifiChange}
            />
            <Checkbox
              label="店狗"
              checked={dogChecked}
              onChange={handleDogChange}
            />
            <Checkbox
              label="店貓"
              checked={catChecked}
              onChange={handleCatChange}
            />
            <Checkbox
              label="吸菸區"
              checked={smokingAreaChecked}
              onChange={handleSmokingAreaChange}
            />
          </div>
        </div>
        <hr className="border-gray-300 w-11/12 mx-auto" />

        <div className="container mx-auto flex-row items-center justify-start ml-8 py-4">
          <div className="flex items-center mb-2">
            <p className="text-[#030712] text-xl me-2 text-left font-bold">
              低消範圍
            </p>

            <div className="relative w-36">
              <div className="absolute left-0 top-0 h-full flex items-center justify-center w-12">
                <img
                  src="../dollar-sign.svg"
                  alt="Dollar Sign"
                  className="w-4 h-4 text-gray-600"
                />
              </div>
              <input
                type="search"
                className="w-full h-11 px-4 pl-12 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-[40px] shadow-lg"
                placeholder="最低價格"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <hr className="border-gray-300 w-11/12 mx-auto" />
        <div className="container mx-auto flex-col items-center justify-start ml-8 py-4">
          <div className="flex items-center mb-2">
            <p className="text-[#030712] text-xl me-2 mb-2 text-left font-bold">
              消費時間
            </p>
          </div>

          <ButtonGroup
            variant="outlined"
            size="lg"
            className="flex items-center"
          >
            <Button
              className={`${activeButton2 === "alltime" ? "bg-[#D0B8A8]" : ""}`}
              onClick={() => {
                handleButtonClick2("alltime");
                settimelimit("");
              }}
            >
              所有
            </Button>

            <Button
              className={`${activeButton2 === "unlimit" ? "bg-[#D0B8A8]" : ""}`}
              onClick={() => {
                handleButtonClick2("unlimit");
                settimelimit("&no_time_limit=true");
              }}
            >
              不限時
            </Button>
          </ButtonGroup>
        </div>
        <hr className="border-gray-300 w-full mx-auto" />

        <div className="flex justify-center items-center flex-row justify-between mt-4 mb-2">
          <p
            className="ml-8 text-[#030712] text-md text-left font-bold border-b border-black"
            onClick={resetFilters}
          >
            清除全部
          </p>
          <Button
            className="bg-[#D0B8A8] px-6 py-2 text-lg mr-8 mb-4"
            onClick={() => {
              showresult();
              jump(all);
            }}
          >
            顯示23間咖啡廳
          </Button>
        </div>
      </Card>
    </>
  );
}
