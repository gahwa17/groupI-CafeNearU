export default function shopBasicInfoUpdate(token, formData) {
    const header = {
        Authorization: `Bearer ${token}`,
    };
    const body = formData;

    const data = fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/shop-owners/basic-info`,
        {
            headers: header,
            body,
            method: "PUT",
        }
    ).then((res) => res.json());

    return data;
}
