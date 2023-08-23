import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
} from "@material-tailwind/react";

export default function PublishUpdate({ open, handleOpen }) {
    return (
        <Dialog
            size="xxl"
            open={open}
            handler={handleOpen}
            className="rounded-md"
        >
            <div className="flex items-center justify-between">
                <DialogHeader className="flex flex-col items-start border-l-[#7D6E83] border-l-8 ">
                    <div className="text-xl text-[#7D6E83] mb-1 w-fit py-1 transition-all text-left font-medium">
                        發布設定
                    </div>
                    <div className="text-base text-gray-700 mr-2 text-left font-normal">
                        預覽畫面，並將店家資訊公開至
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
            <DialogBody divider className="flex flex-col"></DialogBody>
            <DialogFooter className="space-x-4 ">
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
