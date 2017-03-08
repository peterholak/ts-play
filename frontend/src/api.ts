import * as schema from '../../api/schema'

export async function share(contents: string): Promise<string> {
    const response = await fetch(
        "/api/share",
        {
            method: "POST",
            body: contents,
            headers: {
                "Content-Type": "text/plain"
            }
        }
    )
    const data: schema.Share = await response.json()
    return data.snippetId
}

export async function load(snippetId: string): Promise<string> {
    const response = await fetch(`/api/load/${snippetId}`)
    const data: schema.Load = await response.json()
    return data.code
}
