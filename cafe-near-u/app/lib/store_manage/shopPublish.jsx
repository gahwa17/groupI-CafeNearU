export default function shopPublish({ token, isPublish }) {
    const header = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    const body = JSON.stringify(isPublish);

    const data = fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/shop-owners/publish`,
        { headers: header, body, method: "POST" }
    ).then((res) => res.json());

    return data;
}
