"use client";

import useSWR from "swr";

export default function useStatus(shopId) {
    const fetcher = (url) => fetch(url).then((res) => res.json());

    const { data, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_HOST}/shops/${shopId}/status`,
        fetcher
    );

    console.log("data", data);

    return { status: data, isLoading, isError: error, mutate };
}
