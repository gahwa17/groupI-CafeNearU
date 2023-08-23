export default async function menuUpdate({ token, menu }) {
    const header = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    const body = JSON.stringify(menu);

    const data = fetch(`${process.env.NEXT_PUBLIC_API_HOST}/shop-owners/menu`, {
        headers: header,
        body,
        method: "PUT",
    }).then((res) => res.json());

    return data;
}
