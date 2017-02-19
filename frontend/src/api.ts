export function share(contents: string) {
    return fetch(
        "/api/share",
        {
            method: "POST",
            body: JSON.stringify(contents),
            headers: {
                "Content-Type": "text/plain"
            }
        }
    )
}