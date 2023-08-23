import { Rating, Card } from "@material-tailwind/react";

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

function TrashIcon({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`h-5 w-5 ${className}`}
        >
            <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
            />
        </svg>
    );
}
export default function Comment({ comment }) {
    const { rating, created_at, content, user } = comment;
    return (
        <Card className="rounded-md h-auto group relative">
            <TrashIcon className="absolute top-4 right-4 text-gray-400 group-hover:text-gray-600 cursor-pointer hidden group-hover:inline" />
            <div className="flex flex-row items-start p-4 gap-2">
                <div className="rounded-full w-12 h-12 bg-gray-200"></div>
                <div className="text-base flex flex-col items-start">
                    <div className="text-lg text-gray-800">{user.name}</div>
                    <div className="text-gray-600 text-sm">{created_at}</div>
                </div>
                <Rating
                    value={Math.round(rating)}
                    ratedIcon={<RatedIcon width={20} height={20} />}
                    unratedIcon={<UnratedIcon width={20} height={20} />}
                    className="ml-2 self-center"
                    readonly
                />
            </div>
            <div className="px-6 py-2 pb-6">{content}</div>
        </Card>
    );
}
