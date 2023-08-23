"use client";

import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    ButtonGroup,
    TabPanel,
    TabsBody,
    TabsHeader,
    Tab,
    Tabs,
} from "@material-tailwind/react";

export default function StatusUpdate({ open, handleOpen, data }) {
    return (
        <Dialog
            size="md"
            open={open}
            handler={handleOpen}
            className="rounded-md"
        >
            <div className="flex items-center justify-between">
                <DialogHeader className="flex flex-col items-start border-l-[#B79681] border-l-8 rounded-t-md">
                    <div className="text-xl text-[#B79681] mb-1 w-fit py-1 transition-all text-left font-medium">
                        店況快速更新
                    </div>
                    <div className="text-base text-gray-700 mr-2 text-left font-normal">
                        營業狀況、座位剩餘
                    </div>
                </DialogHeader>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="mr-3 h-5 w-5 cursor-pointer"
                    onClick={handleOpen}
                >
                    <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <DialogBody divider>
                <div className="flex flex-row gap-6">
                    <div className="pl-2 col-span-4 self-center text-gray-800 ">
                        營業資訊
                    </div>
                    <ButtonGroup variant="outlined" className="col-span-8">
                        <Button className="text-base font-normal">
                            正常營業
                        </Button>
                        <Button className="text-base font-normal">
                            時間異動
                        </Button>
                        <Button className="text-base font-normal">店休</Button>
                    </ButtonGroup>
                </div>
                <div className="flex flex-row gap-6 mt-4">
                    <div className="pl-2 col-span-4 text-gray-800 ">
                        剩餘座位
                    </div>
                    <Tabs
                        value="normal"
                        orientation="horizontal"
                        className="col-span-8 flex flex-col self-center"
                    >
                        <TabsHeader className="w-auto">
                            {data.map(({ label, value }) => (
                                <Tab key={value} value={value}>
                                    {label}
                                </Tab>
                            ))}
                        </TabsHeader>
                        <TabsBody className="w-80 flex flex-row self-center my-4">
                            {data.map(({ value }) => (
                                <TabPanel
                                    key={value}
                                    value={value}
                                    className="py-0"
                                >
                                    <div className="flex flex-row justify-center">
                                        <Button className="bg-[#B79681] text-base text-white rounded-full font-normal p-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 4.5v15m7.5-7.5h-15"
                                                />
                                            </svg>
                                        </Button>
                                        <div className="self-center px-3 text-2xl">
                                            <strong>剩 25 席</strong> / 共 30 席
                                        </div>
                                        <Button className="bg-[#c3ab9b] text-base text-white rounded-full font-normal p-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19.5 12h-15"
                                                />
                                            </svg>
                                        </Button>
                                    </div>
                                </TabPanel>
                            ))}
                        </TabsBody>
                    </Tabs>
                </div>
            </DialogBody>
            <DialogFooter className="space-x-4 ">
                <Button
                    variant="outlined"
                    onClick={handleOpen}
                    className="text-base px-6 border border-[#B79681] text-[#B79681] "
                >
                    關閉
                </Button>
                <Button
                    onClick={handleOpen}
                    className="text-base px-6 bg-[#B79681] text-white"
                >
                    更新
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
