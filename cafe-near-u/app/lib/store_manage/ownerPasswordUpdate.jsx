export default function ownerPasswordUpdate({ token, password }) {
    const header = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    const body = JSON.stringify({ ...password });

    const data = fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/shop-owners/update-password`,
        { headers: header, body, method: "PUT" }
    ).then((res) => res.json());

    return data;
}
