import {
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Button,
    Card,
    Typography,
} from "@material-tailwind/react";

const TABLE_HEAD = ["品項", "價格", "分類", ""];

const TABLE_ROWS = [
    {
        item: "芋頭",
        price: 100,
        category: "難吃的東西",
    },
    {
        item: "好喝可樂",
        price: 200,
        category: "特色飲品",
    },
    {
        item: "好吃冰淇淋",
        price: 300,
        category: "特色甜點",
    },
];

export default function MenuUpdate({ open, handleOpen }) {
    return (
        <Dialog
            size="xxl"
            open={open}
            handler={handleOpen}
            className="lg:container lg:mx-auto overflow-scroll z-[100]"
        >
            <div className="flex items-center justify-between sticky top-0 bg-white z-50">
                <DialogHeader className="flex flex-col items-start border-l-[#7D6E83] border-l-8 lg:container lg:mx-auto ">
                    <div className="text-xl text-[#7D6E83] mb-1 w-fit py-1 transition-all text-left font-medium">
                        設定菜單資料
                    </div>
                    <div className="text-base text-gray-700 mr-2 text-left font-normal">
                        將店家菜單匯入至{" "}
                        <span className="font-logo">CaféNearU</span>
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
                <div className="ml-0 mt-3 font-normal text-lg mb-4">
                    你可以選擇 <strong>匯入 Excel 檔</strong>{" "}
                    <Button
                        variant="outlined"
                        className="ml-6 text-base px-6 border border-[#7D6E83] text-[#7D6E83] "
                    >
                        上傳 Excel 檔
                    </Button>
                </div>
                <Card className="h-full w-full overflow-scroll">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_ROWS.map(
                                ({ item, price, category }, index) => {
                                    const isLast =
                                        index === TABLE_ROWS.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={item}>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {item}
                                                </Typography>
                                            </td>
                                            <td
                                                className={`${classes} bg-blue-gray-50/50`}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {price}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {category}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </Card>
                <div className="ml-0 mt-12 font-normal text-lg mb-4">
                    或者 <strong>手動輸入菜單資訊</strong>{" "}
                </div>
                <div className="grid grid-cols-12 gap-2">
                    <Input
                        label="品項"
                        className="py-4"
                        containerProps={{
                            className: "col-span-12 xl:col-span-3",
                        }}
                    />
                    <Input
                        label="價格"
                        className="py-4"
                        containerProps={{
                            className: "col-span-12 xl:col-span-3",
                        }}
                    />
                    <Input
                        label="分類"
                        className="py-4"
                        containerProps={{
                            className: "col-span-12 xl:col-span-3",
                        }}
                    />
                    <Button
                        onClick={handleOpen}
                        className="text-base px-6 xl:py-0  bg-[#7D6E83] text-white  col-span-12 py-2  xl:col-span-2"
                    >
                        新增項目至菜單
                    </Button>
                </div>
                <Card className="h-full w-full overflow-scroll mt-8">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th
                                        key={head}
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_ROWS.map(
                                ({ item, price, category }, index) => {
                                    const isLast =
                                        index === TABLE_ROWS.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={item}>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {item}
                                                </Typography>
                                            </td>
                                            <td
                                                className={`${classes} bg-blue-gray-50/50`}
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {price}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {category}
                                                </Typography>
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </Card>
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
