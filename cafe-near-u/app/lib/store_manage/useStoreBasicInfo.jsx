"use client";

import useSWR from "swr";

export default function useStoreBasicInfo(shopId) {
    const fetcher = (url) =>
        fetch(url).then((res) => {
            if (!res.ok) {
                const error = new Error(
                    "An error occurred while fetching the data."
                );
                // Attach extra info to the error object.
                error.info = res.json();
                error.status = res.status;
                throw error;
            }
            return res.json();
        });
    const { data, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_HOST}/shops/${shopId}/basic-info`,
        fetcher
    );
    return { basicInfo: data, isLoading, isError: error, mutate };
}
