import { Rating, Button } from "@material-tailwind/react";
import Comment from "./Comment";

function RatedIcon({ width, height }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height={height}
            viewBox="0 -960 960 960"
            width={width}
            fill="#DFD3C3"
        >
            <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Z" />
        </svg>
    );
}

function UnratedIcon({ width, height }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            height={height}
            viewBox="0 -960 960 960"
            width={width}
            fill="#DFD3C3"
        >
            <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
        </svg>
    );
}

export default function RatingAndComments({ summary, comments }) {
    return (
        <>
            <div className="self-start m-4 mb-2 ml-0 text-xl font-light border-0 border-l-4 border-l-[#D0B8A8] pl-2 text-gray-800 flex flex-row gap-4 items-center justify-between">
                <div>評論 &nbsp; </div>
                <Button
                    variant=""
                    className="p-2 border bg-[#af998a] text-white font-normal text-sm"
                >
                    撰寫新評論
                </Button>
            </div>
            <div className="flex flex-row justify-start gap-4 mt-4 items-center mb-6 lg:mb-0">
                <Rating
                    value={Math.round(summary.average_total_rating)}
                    ratedIcon={<RatedIcon width={40} height={40} />}
                    unratedIcon={<UnratedIcon width={40} height={40} />}
                    className="ml-2"
                    readonly
                />
                <div className="text-gray-800 text-2xl font-normal">
                    {`${summary.average_total_rating} / ${summary.total_comments} 則評論`}
                </div>
            </div>
            <div className="hidden lg:grid grid-cols-9 justify-start gap-x-8 gap-y-4 mt-4 ml-2 flex-wrap mb-6">
                <div className="col-span-4 xl:col-span-3 flex flex-row gap-2 items-center ">
                    <div className="text-gray-800 text-lg font-normal ">
                        {`清潔`}
                    </div>
                    <Rating
                        value={Math.round(summary.average_cleanliness)}
                        ratedIcon={<RatedIcon width={25} height={25} />}
                        unratedIcon={<UnratedIcon width={25} height={25} />}
                        className="ml-2"
                        readonly
                    />
                    <div className="text-gray-800 text-lg font-normal">
                        {`${summary.average_cleanliness}`}
                    </div>
                </div>
                <div className="col-span-4 xl:col-span-3 flex flex-row gap-2 items-center">
                    <div className="text-gray-800 text-lg font-normal">
                        {`網速`}
                    </div>
                    <Rating
                        value={Math.round(summary.average_wifi)}
                        ratedIcon={<RatedIcon width={25} height={25} />}
                        unratedIcon={<UnratedIcon width={25} height={25} />}
                        className="ml-2"
                        readonly
                    />
                    <div className="text-gray-800 text-lg font-normal">
                        {`${summary.average_wifi}`}
                    </div>
                </div>
                <div className="col-span-4 xl:col-span-3 flex flex-row gap-2 items-center">
                    <div className="text-gray-800 text-lg font-normal">
                        {`服務`}
                    </div>
                    <Rating
                        value={Math.round(summary.average_service)}
                        ratedIcon={<RatedIcon width={25} height={25} />}
                        unratedIcon={<UnratedIcon width={25} height={25} />}
                        className="ml-2"
                        readonly
                    />
                    <div className="text-gray-800 text-lg font-normal">
                        {`${summary.average_service}`}
                    </div>
                </div>
                <div className="col-span-4 xl:col-span-3  flex flex-row gap-2 items-center">
                    <div className="text-gray-800 text-lg font-normal">
                        {`食物`}
                    </div>
                    <Rating
                        value={Math.round(summary.average_total_rating)}
                        ratedIcon={<RatedIcon width={25} height={25} />}
                        unratedIcon={<UnratedIcon width={25} height={25} />}
                        className="ml-2"
                        readonly
                    />
                    <div className="text-gray-800 text-lg font-normal">
                        {`${summary.average_total_rating}`}
                    </div>
                </div>
                <div className="col-span-4 xl:col-span-3 flex flex-row gap-2 items-center">
                    <div className="text-gray-800 text-lg font-normal">
                        {`氛圍`}
                    </div>
                    <Rating
                        value={Math.round(summary.average_total_rating)}
                        ratedIcon={<RatedIcon width={25} height={25} />}
                        unratedIcon={<UnratedIcon width={25} height={25} />}
                        className="ml-2"
                        readonly
                    />
                    <div className="text-gray-800 text-lg font-normal">
                        {`${summary.average_total_rating}`}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
                {comments.map((comment) => (
                    <div className="col-span-12 xl:col-span-6" key={comment.id}>
                        <Comment comment={comment} />
                    </div>
                ))}
            </div>
        </>
    );
}
