"use client";

import {
    Input,
    Select,
    Option,
    Textarea,
    ListItemSuffix,
    IconButton,
    Typography,
    Button,
    Card,
    List,
    ListItem,
    Tabs,
    Tab,
    TabsHeader,
    TabsBody,
    TabPanel,
    Checkbox,
    ListItemPrefix,
} from "@material-tailwind/react";
import dynamic from "next/dynamic";
import "react-time-picker/dist/TimePicker.css";
import { useFormik } from "formik";
import { useState } from "react";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import shopBasicInfoUpdate from "../../lib/store_manage/shopBasicInfoUpdate";
import Cookies from "js-cookie";

const TimePicker = dynamic(() => import("react-time-picker"), { ssr: false });
function TrashIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
        >
            <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
            />
        </svg>
    );
}

const dataOp = [
    {
        label: "星期一",
        value: 1,
    },
    {
        label: "星期二",
        value: 2,
    },
    {
        label: "星期三",
        value: 3,
    },
    {
        label: "星期四",
        value: 4,
    },
    {
        label: "星期五",
        value: 5,
    },
    {
        label: "星期六",
        value: 6,
    },
    {
        label: "星期日",
        value: 7,
    },
];

const Map = ({ pos }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    return (
        isLoaded && (
            <GoogleMap
                zoom={15}
                center={pos}
                mapContainerClassName="w-full h-80 rounded-md"
            >
                {<Marker position={pos} />}
            </GoogleMap>
        )
    );
};

const AutoComplete = ({ setPos, formik }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    const {
        ready,
        suggestions: { status, data },
        clearSuggestions,
        value,
        setValue,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope here */
            region: "tw",
            // types: ["address"],
        },
        callbackName: "initMap",
    });

    const handleInput = (e) => {
        // Update the keyword of the input element
        setValue(e.target.value);
        formik.setFieldValue("storeAddress", e.target.value);
    };

    const handleSelect =
        ({ description }) =>
        () => {
            // When user selects a place, we can replace the keyword without request data from API
            // by setting the second parameter to "false"
            setValue(description, false);
            clearSuggestions();

            // Get latitude and longitude via utility functions
            getGeocode({ address: description }).then((results) => {
                const { lat, lng } = getLatLng(results[0]);
                console.log("📍 Coordinates: ", { lat, lng });
                setPos({ lat, lng });
            });
        };

    const renderSuggestions = () => (
        <div
            className="absolute top-14  flex py-2  rounded-md  bg-white
                  flex-col divide-slate-400/25 divide-y text-lg border border-gray-300 shadow-md transition-all z-30 max-h-80 overflow-auto "
        >
            {data.map((suggestion) => {
                const {
                    place_id,
                    structured_formatting: { main_text, secondary_text },
                } = suggestion;
                return (
                    <a
                        className="py-2 mx-2   bg-white grid grid-cols-6 justify-center items-center hover:bg-[#ebebeb] cursor-pointer transition-all gap-2"
                        key={place_id}
                        onClick={handleSelect(suggestion)}
                    >
                        <div className="col-span-2 font-md text-base">
                            {main_text}
                        </div>
                        <div className="col-span-4 font-light text-sm">
                            {secondary_text}
                        </div>
                    </a>
                );
            })}
        </div>
    );

    return (
        <>
            <Input
                label="店家地址"
                className="py-4"
                id="storeAddress"
                name="storeAddress"
                size="lg"
                containerProps={{
                    className: "w-auto my-2",
                }}
                onChange={handleInput}
                value={value}
                disabled={!ready}
            />
            {status === "OK" && <ul>{renderSuggestions()}</ul>}
        </>
    );
};

export default function InfoUpdateForm() {
    const [timeFrom, setTimeFrom] = useState([
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
    ]);
    const [timeTo, setTimeTo] = useState([
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
        "00:00",
    ]);
    const [disabled, setDisabled] = useState([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]);
    const [pos, setPos] = useState({ lat: 0, lng: 0 });
    const [socialList, setSocialList] = useState([]);
    const [ruleList, setRuleList] = useState([]);
    const [serviceList, setServiceList] = useState([]);
    const [file, setFile] = useState([]);
    const formik = useFormik({
        initialValues: {
            storeName: "",
            storeType: "",
            storeAddress: "",
            storePhone: "",
            storeIntro: "",
            socialMedia: {
                name: "",
                url: "",
            },
            rules: {
                minCharge: "",
                minChargeInfo: "",
                timeLimit: "",
                timeLimitInfo: "",
                customRuleTitle: "",
                customRuleInfo: "",
            },
            services: {
                socket: false,
                wifi: false,
                cat: false,
                dog: false,
                smoke: false,
                customServiceTitle: "",
                customServiceInfo: "",
            },
            operationHours: {
                timeFrom: ["", "", "", "", "", "", ""],
                timeTo: ["", "", "", "", "", "", ""],
                restDay: [false, false, false, false, false, false, false],
            },
        },
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.storeName);
            formData.append("type", values.storeType);
            formData.append("address", values.storeAddress);
            formData.append("telephone", values.storePhone);
            formData.append("nearest_MRT", "暫時沒有");
            formData.append("introduction", values.storeIntro);

            // social media
            formData.append(
                "facebook",
                socialList.filter((_) => _.name === "facebook")[0]?.url
            );
            formData.append(
                "ig",
                socialList.filter((_) => _.name === "instagram")[0]?.url
            );
            formData.append(
                "line",
                socialList.filter((_) => _.name === "line")[0]?.url
            );

            // rules
            let rules = [];
            rules.push({
                id: 1,
                type: "time_limit",
                heading: !!values.rules.timeLimit,
                content: values.rules.timeLimit
                    ? `本店限時 ${values.rules.timeLimit} 小時，${values.rules.timeLimitInfo}`
                    : "本店無時間限制",
            });

            rules.push({
                id: 2,
                type: "min_order",
                heading: values.rules.minCharge,
                content: values.rules.minChargeInfo,
            });

            // eslint-disable-next-line array-callback-return
            ruleList.map((item, index) => {
                rules.push({
                    id: index + 3,
                    type: "customize",
                    heading: item.title,
                    content: item.info,
                });
            });

            formData.append("rules", JSON.stringify(rules));

            // services
            let services = [];
            services.push({
                id: 1,
                type: "plug",
                content: values.services.socket,
            });
            services.push({
                id: 2,
                type: "wifi",
                content: values.services.wifi,
            });
            services.push({
                id: 3,
                type: "smoke",
                content: values.services.smoke,
            });
            services.push({
                id: 4,
                type: "cat",
                content: values.services.cat,
            });
            services.push({
                id: 5,
                type: "dog",
                content: values.services.dog,
            });

            serviceList.map((item, index) => {
                services.push({
                    id: index + 6,
                    type: "customize",
                    content: item.title,
                });
            });
            formData.append("service_and_equipment", JSON.stringify(services));
            formData.append("opening_hour", JSON.stringify(timeFrom));
            formData.append("closing_hour", JSON.stringify(timeTo));

            // images
            formData.append("primary_image", file[0]);
            formData.append("secondary_image_1", file[1] ? file[1] : "");
            formData.append("secondary_image_2", file[2] ? file[2] : "");

            for (let pair of formData.entries()) {
                console.log(pair[0] + ", " + pair[1]);
            }

            const res = await shopBasicInfoUpdate(
                Cookies.get("token"),
                formData
            );

            console.log(res);
        },
    });

    function handleChange(e) {
        console.log(e.target.files);
        const arr = Array.from(e.target.files).slice(0, 3);
        setFile(arr.map((f) => URL.createObjectURL(f)));
    }

    return (
        <form
            className="grid grid-cols-12 gap-4"
            onSubmit={formik.handleSubmit}
        >
            <div className="col-span-12 lg:col-span-6 flex flex-col">
                <div className="ml-0 mt-3 font-normal">基本資訊</div>
                <div className="grid grid-cols-12">
                    <div className="col-span-12 mb-4 lg:col-span-6 lg:mr-2 lg:mb-0">
                        <Input
                            label="店家名稱"
                            id="storeName"
                            name="storeName"
                            className="py-4"
                            size="lg"
                            containerProps={{
                                className: "md:my-2",
                            }}
                            onChange={formik.handleChange}
                            value={formik.values.storeName}
                        />
                    </div>
                    <div className="col-span-12 mb-2 lg:col-span-6 lg:mb-0">
                        <Select
                            variant="outlined"
                            id="storeType"
                            name="storeType"
                            size="lg"
                            label="咖啡廳類型"
                            className="col-start-7 col-span-6"
                            containerProps={{
                                className: "md:my-2",
                            }}
                            onChange={async (value) => {
                                await formik.setFieldValue("storeType", value);
                            }}
                            value={formik.values.storeType}
                        >
                            <Option value="workspace">工作 / 唸書型</Option>
                            <Option value="leisure">放鬆 / 休閒型</Option>
                            <Option value="pet">寵物型</Option>
                        </Select>
                    </div>
                </div>
                <div className="col-span-12 relative">
                    <AutoComplete setPos={setPos} formik={formik} />
                </div>

                <div className="col-span-12">
                    <Input
                        label="聯絡電話"
                        type="tel"
                        className="py-4"
                        id="storePhone"
                        name="storePhone"
                        size="lg"
                        containerProps={{
                            className: "w-auto my-2",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.storePhone}
                    />
                </div>
                <div className="col-span-12">
                    <Textarea
                        label="店家簡介"
                        className="py-4"
                        id="storeIntro"
                        name="storeIntro"
                        size="lg"
                        containerProps={{
                            className: "w-auto my-2",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.storeIntro}
                    />
                </div>
                <div className="ml-0 mt-4 font-normal">社群媒體</div>
                <div className=" col-span-12 grid grid-cols-12 xl:grid-cols-10 mt-2 mb-2">
                    <div className="my-2 xl:my-0 col-span-12 xl:col-span-5 xl:mr-auto xl:mb-4 xl:w-11/12">
                        <Select
                            variant="outlined"
                            size="lg"
                            id="socialMedia.name"
                            name="socialMedia.name"
                            label="社群類型"
                            containerProps={{
                                className: "",
                            }}
                            onChange={async (value) => {
                                await formik.setFieldValue(
                                    "socialMedia.name",
                                    value
                                );
                            }}
                            value={formik.values.socialMedia.name}
                        >
                            <Option value="facebook">Facebook</Option>
                            <Option value="instagram">Instagram</Option>
                            <Option value="line">LINE</Option>
                        </Select>
                    </div>
                    <div className="my-2 xl:my-0 col-span-12 xl:col-span-5">
                        <Input
                            label="社群帳號 / 網址"
                            id="socialMedia.url"
                            name="socialMedia.url"
                            size="lg"
                            className="py-4"
                            onChange={formik.handleChange}
                            value={formik.values.socialMedia.url}
                        />
                    </div>
                    <Button
                        className="my-2 xl:my-0 py-2 px-1 text-base bg-[#7D6E83] col-span-12"
                        onClick={() =>
                            setSocialList([
                                ...socialList,
                                formik.values.socialMedia,
                            ])
                        }
                    >
                        新增至社群清單
                    </Button>
                </div>
                {socialList.length ? (
                    <Card className="w-auto">
                        <List>
                            {socialList.map((item, index) => (
                                <ListItem
                                    ripple={false}
                                    className="py-1 pr-1 pl-4"
                                    key={index}
                                >
                                    <div className="flex flex-row gap-2">
                                        <strong> {item.name} </strong>{" "}
                                        <div> {item.url} </div>
                                    </div>
                                    <ListItemSuffix>
                                        <IconButton
                                            variant="text"
                                            color="blue-gray"
                                            onClick={() => {
                                                setSocialList(
                                                    socialList.filter(
                                                        (_, i) => i !== index
                                                    )
                                                );
                                            }}
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    </ListItemSuffix>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                ) : (
                    <></>
                )}
                <div className="ml-0 mt-8 font-normal">營業時間</div>
                <Tabs
                    value="mon"
                    orientation="horizontal"
                    className="col-span-8 flex flex-col self-center mt-4"
                >
                    <TabsHeader className="w-auto">
                        {dataOp.map(({ label }, index) => (
                            <Tab key={index} value={index}>
                                {label}
                            </Tab>
                        ))}
                    </TabsHeader>
                    <TabsBody className="w-80 flex flex-row self-center my-4">
                        {dataOp.map(({ value }, index) => (
                            <TabPanel
                                key={index}
                                value={index}
                                className="py-0"
                            >
                                <div className="flex flex-row justify-around">
                                    <div className="self-center px-3 text-2xl flex flex-col gap-2 justify-between">
                                        <TimePicker
                                            name={`operationHours.timeFrom[${index}]`}
                                            id="operationHours.timeFrom"
                                            onChange={(e) => {
                                                formik.setFieldValue(
                                                    `operationHours.timeFrom[${index}]`,
                                                    e
                                                );
                                                setTimeFrom(
                                                    timeFrom.map((_, i) => {
                                                        if (i === index)
                                                            return e;
                                                        return _;
                                                    })
                                                );
                                            }}
                                            value={timeFrom[index]}
                                            className="flex flex-row text-base ring-0"
                                            disableClock
                                            disabled={disabled[index]}
                                        />
                                        <div className="mx-2 text-base text-center">
                                            {" "}
                                            至{" "}
                                        </div>
                                        <TimePicker
                                            onChange={(e) => {
                                                formik.setFieldValue(
                                                    `operationHours.timeTo[${index}]`,
                                                    e
                                                );
                                                setTimeTo(
                                                    timeTo.map((_, i) => {
                                                        if (i === index)
                                                            return e;
                                                        return _;
                                                    })
                                                );
                                            }}
                                            name={`operationHours.timeTo[${index}]`}
                                            id="operationHours.timeTo"
                                            value={timeTo[index]}
                                            className="flex flex-row text-base ring-0"
                                            disableClock
                                            disabled={disabled[index]}
                                        />
                                    </div>
                                    <div className="self-center">
                                        <Checkbox
                                            name={`restDay[${index}]`}
                                            id="restDay"
                                            label="休息日"
                                            onClick={() => {
                                                setDisabled(
                                                    disabled.map((_, i) => {
                                                        if (i === index)
                                                            return !_;
                                                        return _;
                                                    })
                                                );
                                            }}
                                            onChange={formik.handleChange}
                                            value={() =>
                                                formik.setFieldValue(
                                                    `restDay[${index}]`,
                                                    !formik.values.restDay[
                                                        index
                                                    ]
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </TabPanel>
                        ))}
                    </TabsBody>
                </Tabs>
                <div className="ml-0 mt-8 font-normal">最低消費</div>
                <div className="col-span-12 grid grid-cols-12 gap-2">
                    <Input
                        label="最低消費金額（預估值）"
                        className="py-4"
                        size="lg"
                        name="rules.minCharge"
                        id="rules.minCharge"
                        containerProps={{
                            className: "col-span-12 lg:col-span-6 my-2",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.rules.minCharge}
                    />
                    <Input
                        label="最低消費金額（補充資訊）"
                        className="py-4"
                        size="lg"
                        name="rules.minChargeInfo"
                        id="rules.minChargeInfo"
                        containerProps={{
                            className: "col-span-12 lg:col-span-6 my-2",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.rules.minChargeInfo}
                    />
                </div>
                <div className="ml-0 mt-8 font-normal">時間限制</div>
                <div className="col-span-12 grid grid-cols-12 gap-2">
                    <Input
                        label="時間限制（以小時計算）"
                        name="rules.timeLimit"
                        id="rules.timeLimit"
                        className="py-4"
                        size="lg"
                        containerProps={{
                            className: "col-span-12 lg:col-span-6 my-2",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.rules.timeLimit}
                    />
                    <Input
                        label="時間限制（補充資訊）"
                        name="rules.timeLimitInfo"
                        id="rules.timeLimitInfo"
                        className="py-4"
                        size="lg"
                        containerProps={{
                            className: "col-span-12 lg:col-span-6 my-2",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.rules.timeLimitInfo}
                    />
                </div>
                <div className="ml-0 mt-8 font-normal">自訂規則</div>
                <div className="col-span-12 grid grid-cols-12">
                    <Input
                        label="自訂規則（標題）"
                        name="rules.customRuleTitle"
                        id="rules.customRuleTitle"
                        className="py-4"
                        size="lg"
                        containerProps={{
                            className: "col-span-12 my-2",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.rules.customRuleTitle}
                    />
                    <Textarea
                        label="自訂規則（補充資訊）"
                        name="rules.customRuleInfo"
                        id="rules.customRuleInfo"
                        className="py-4"
                        size="lg"
                        containerProps={{
                            className: "col-span-12 my-2",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.rules.customRuleInfo}
                    />
                    <Button
                        className="my-2 xl:my-0 py-2 px-1 text-base bg-[#7D6E83] col-span-12"
                        onClick={() =>
                            setRuleList([
                                ...ruleList,
                                {
                                    type: formik.values.rules.customRuleTitle,
                                    content: formik.values.rules.customRuleInfo,
                                },
                            ])
                        }
                    >
                        新增至自訂規則清單
                    </Button>

                    {ruleList.length ? (
                        <Card className="col-span-12">
                            <List>
                                {ruleList.map((item, index) => (
                                    <ListItem
                                        ripple={false}
                                        className="py-1 pr-1 pl-4"
                                        key={index}
                                    >
                                        <div className="flex flex-row gap-2">
                                            <strong> {item.type} </strong>
                                            <div>{item.content}</div>
                                        </div>
                                        <ListItemSuffix>
                                            <IconButton
                                                variant="text"
                                                color="blue-gray"
                                                onClick={() => {
                                                    setRuleList(
                                                        ruleList.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        )
                                                    );
                                                }}
                                            >
                                                <TrashIcon />
                                            </IconButton>
                                        </ListItemSuffix>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="ml-0 mt-8 font-normal">設備與服務</div>
                <List className="flex-row">
                    <ListItem className="p-0">
                        <label
                            htmlFor="horizontal-list-socket"
                            className="flex w-full cursor-pointer items-center px-3 py-2"
                        >
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id="horizontal-list-socket"
                                    ripple={false}
                                    className="hover:before:opacity-0"
                                    containerProps={{
                                        className: "p-0",
                                    }}
                                    name="services.socket"
                                    onChange={formik.handleChange}
                                    value={() =>
                                        formik.setFieldValue(
                                            "services.socket",
                                            !formik.values.services.socket
                                        )
                                    }
                                />
                            </ListItemPrefix>
                            <Typography
                                color="blue-gray"
                                className="text-sm xl:text-base font-medium"
                            >
                                插座
                            </Typography>
                        </label>
                    </ListItem>
                    <ListItem className="p-0">
                        <label
                            htmlFor="horizontal-list-wifi"
                            className="flex w-full cursor-pointer items-center px-3 py-2"
                        >
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id="horizontal-list-wifi"
                                    ripple={false}
                                    className="hover:before:opacity-0"
                                    containerProps={{
                                        className: "p-0",
                                    }}
                                    name="services.wifi"
                                    onChange={formik.handleChange}
                                    value={() =>
                                        formik.setFieldValue(
                                            "services.wifi",
                                            !formik.values.services.wifi
                                        )
                                    }
                                />
                            </ListItemPrefix>
                            <Typography
                                color="blue-gray"
                                className="text-sm xl:text-base font-medium"
                            >
                                WiFi
                            </Typography>
                        </label>
                    </ListItem>
                    <ListItem className="p-0">
                        <label
                            htmlFor="horizontal-list-cat"
                            className="flex w-full cursor-pointer items-center px-3 py-2"
                        >
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id="horizontal-list-cat"
                                    ripple={false}
                                    className="hover:before:opacity-0"
                                    containerProps={{
                                        className: "p-0",
                                    }}
                                    name="services.cat"
                                    onChange={formik.handleChange}
                                    value={() =>
                                        formik.setFieldValue(
                                            "services.cat",
                                            !formik.values.services.cat
                                        )
                                    }
                                />
                            </ListItemPrefix>
                            <Typography
                                color="blue-gray"
                                className="text-sm xl:text-base font-medium"
                            >
                                店貓
                            </Typography>
                        </label>
                    </ListItem>
                    <ListItem className="p-0">
                        <label
                            htmlFor="horizontal-list-dog"
                            className="flex w-full cursor-pointer items-center px-3 py-2"
                        >
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id="horizontal-list-dog"
                                    ripple={false}
                                    className="hover:before:opacity-0"
                                    containerProps={{
                                        className: "p-0",
                                    }}
                                    name="services.dog"
                                    onChange={formik.handleChange}
                                    value={() =>
                                        formik.setFieldValue(
                                            "services.dog",
                                            !formik.values.services.dog
                                        )
                                    }
                                />
                            </ListItemPrefix>
                            <Typography
                                color="blue-gray"
                                className="text-sm xl:text-base font-medium"
                            >
                                店狗
                            </Typography>
                        </label>
                    </ListItem>
                    <ListItem className="p-0">
                        <label
                            htmlFor="horizontal-list-smoke"
                            className="flex w-full cursor-pointer items-center px-3 py-2"
                        >
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id="horizontal-list-smoke"
                                    ripple={false}
                                    className="hover:before:opacity-0"
                                    containerProps={{
                                        className: "p-0",
                                    }}
                                    name="services.smoke"
                                    onChange={formik.handleChange}
                                    value={() =>
                                        formik.setFieldValue(
                                            "services.smoke",
                                            !formik.values.services.smoke
                                        )
                                    }
                                />
                            </ListItemPrefix>
                            <Typography
                                color="blue-gray"
                                className="text-sm xl:text-base font-medium"
                            >
                                吸煙區
                            </Typography>
                        </label>
                    </ListItem>
                </List>
                <div className="col-span-12 grid grid-cols-12">
                    <Input
                        label="自訂設備與服務（標題）"
                        className="py-4"
                        size="lg"
                        name="services.customServiceTitle"
                        id="services.customServiceTitle"
                        containerProps={{
                            className: "col-span-12 my-2",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.services.customServiceTitle}
                    />
                    <Textarea
                        label="自訂設備與服務（補充資訊）"
                        className="py-4"
                        size="lg"
                        name="services.customServiceInfo"
                        id="services.customServiceInfo"
                        containerProps={{
                            className: "col-span-12 my-2",
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.services.customServiceInfo}
                    />
                    <Button
                        className="my-2 xl:my-0 py-2 px-1 text-base bg-[#7D6E83] col-span-12"
                        onClick={() =>
                            setServiceList([
                                ...serviceList,
                                {
                                    type: formik.values.services
                                        .customServiceTitle,
                                    content:
                                        formik.values.services
                                            .customServiceInfo,
                                },
                            ])
                        }
                    >
                        新增至自訂設備與服務清單
                    </Button>

                    {serviceList.length ? (
                        <Card className="col-span-12">
                            <List>
                                {serviceList.map((item, index) => (
                                    <ListItem
                                        ripple={false}
                                        className="py-1 pr-1 pl-4"
                                        key={index}
                                    >
                                        <div className="flex flex-row gap-2">
                                            <strong> {item.type} </strong>
                                            <div> {item.content} </div>
                                        </div>
                                        <ListItemSuffix>
                                            <IconButton
                                                variant="text"
                                                color="blue-gray"
                                                onClick={() => {
                                                    setServiceList(
                                                        serviceList.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        )
                                                    );
                                                }}
                                            >
                                                <TrashIcon />
                                            </IconButton>
                                        </ListItemSuffix>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    ) : (
                        <></>
                    )}
                </div>
            </div>

            <div className="col-span-12 lg:col-span-6 m-4 mt-2/4 flex flex-col">
                <div className=" w-auto h-80 rounded-md bg-blue-gray-50 text-4xl text-center flex flex-row justify-center">
                    <Map pos={pos} />
                </div>
                <label
                    for="image_uploads"
                    variant="outlined"
                    className="font-normal mt-4 lg:mt-14 w-full border rounded-md p-3 border-gray-800 cursor-pointer hover:text-white hover:bg-gray-800 transition-all text-lg flex justify-center"
                >
                    上傳店家圖片
                </label>
                <input
                    id="image_uploads"
                    name="image_uploads"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    className="hidden"
                    multiple
                    onChange={handleChange}
                />

                {file &&
                    file.map((item, index) => (
                        <img
                            key={index}
                            src={item}
                            className=" w-8/12 h-8/12  self-center rounded-md bg-blue-gray-50 text-4xl text-center flex flex-row justify-center mt-4"
                        />
                    ))}
            </div>
            <div className="col-span-12 h-[0.5px]  bg-gray-500 my-2"></div>
            <div className="col-span-12 space-x-4 lg:container lg:mx-auto flex flex-row justify-end">
                <Button
                    type="submit"
                    className="w-full lg:w-40 text-base px-6 mb-4 bg-[#7D6E83] text-white"
                >
                    儲存並繼續
                </Button>
            </div>
        </form>
    );
}
