"use client";

import useSWR from "swr";

export default function useOwnerProfile(token) {
    const header = {
        Authorization: `Bearer ${token}`,
    };

    const fetcher = (url) =>
        fetch(url, { headers: header }).then((res) => res.json());

    const { data, error, isLoading, mutate } = useSWR(
        `${process.env.NEXT_PUBLIC_API_HOST}/shop-owners/profile`,
        fetcher
    );

    return { owner: data, isLoading, isError: error, mutate };
}
