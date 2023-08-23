import { Button } from "../MaterialTailwind";

export default function HeaderStore() {
    return (
        <div className="border-b ">
            <div className="lg:container lg:mx-auto flex justify-between sticky top-0">
                <h1 className="text-3xl md:text-4xl py-4 font-logo text-gray-800 self-center ml-4 md:ml-0">
                    CafeNearU
                </h1>
                <Button
                    variant="outlined"
                    className="my-4 text-sm mr-2 md:mr-0"
                >
                    登出店家後台
                </Button>
            </div>
        </div>
    );
}
