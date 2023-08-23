import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Input,
} from "@material-tailwind/react";
import useOwnerProfile from "../../lib/store_manage/useOwnerProfile";
import Cookies from "js-cookie";

export default function AccountUpdate({ open, handleOpen }) {
    const { owner, isLoading, isError, mutate } = useOwnerProfile(
        Cookies.get("token")
    );

    return (
        <Dialog
            size="md"
            open={open}
            handler={handleOpen}
            className="lg:container lg:mx-auto overflow-scroll z-[100]"
        >
            <div className="flex items-center justify-between sticky top-0 bg-white z-50">
                <DialogHeader className="flex flex-col items-start border-l-[#7D6E83] border-l-8 lg:container lg:mx-auto ">
                    <div className="text-xl text-[#7D6E83] mb-1 w-fit py-1 transition-all text-left font-medium">
                        帳戶設定
                    </div>
                    <div className="text-base text-gray-700 mr-2 text-left font-normal">
                        使用者名稱、電子郵箱地址、密碼
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
            <DialogBody className="flex flex-col lg:container lg:mx-auto">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 flex flex-col">
                        <div className="grid grid-cols-12">
                            <div className="col-span-12">
                                <Input
                                    label="使用者名稱"
                                    className="py-4 "
                                    size="lg"
                                    containerProps={{
                                        className: "my-2 col-span-12",
                                    }}
                                />
                                <Button
                                    size="sm"
                                    className="!absolute right-6 top-[30px] rounded"
                                    variant="text"
                                >
                                    編輯
                                </Button>
                            </div>

                            <div className="col-span-12">
                                <Input
                                    label="電子郵箱地址"
                                    type="email"
                                    className="py-4 "
                                    size="lg"
                                    containerProps={{
                                        className: "my-2 col-span-12",
                                    }}
                                />
                                <Button
                                    size="sm"
                                    className="!absolute right-6 top-[90px] rounded"
                                    variant="text"
                                >
                                    編輯
                                </Button>
                            </div>

                            <div className="col-span-12">
                                <Input
                                    label="密碼"
                                    type="password"
                                    className="py-4 "
                                    size="lg"
                                    containerProps={{
                                        className: "my-2 col-span-12",
                                    }}
                                />
                                <Button
                                    size="sm"
                                    className="!absolute right-6 top-[150px] rounded"
                                    variant="text"
                                >
                                    編輯
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogBody>
            <DialogFooter className="space-x-4 lg:container lg:mx-auto">
                <Button
                    variant="outlined"
                    onClick={handleOpen}
                    className="text-base px-6 border border-[#7D6E83] text-[#7D6E83] "
                >
                    關閉
                </Button>
                <Button
                    onClick={handleOpen}
                    className="text-base px-6 bg-[#7D6E83] text-white"
                >
                    更新
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
