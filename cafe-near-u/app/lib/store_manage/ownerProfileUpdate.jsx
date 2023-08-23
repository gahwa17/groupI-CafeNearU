export default async function ownerProfileUpdate({ token, profile }) {
    const header = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    const body = JSON.stringify({ ...profile });

    const data = fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/shop-owners/profile`,
        { headers: header, body, method: "PATCH" }
    ).then((res) => res.json());

    return data;
}
