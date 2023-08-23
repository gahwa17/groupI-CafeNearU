export default async function shopSeatTypeUpdate({ token, seats }) {
    const header = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    const body = JSON.stringify({ ...seats });

    const data = fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/shop-owners/seat-setting`,
        { headers: header, body, method: "POST" }
    ).then((res) => res.json());

    return data;
}
