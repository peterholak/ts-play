import * as express from 'express'
import { SnippetStorage, makeSnippet } from './snippets'

const maxSize = 1e6
const app = express()
const storage = SnippetStorage.withFile("./snippets.db")

app.get("/api", (request, response) => {
    response.send("Hello world")
})

app.post("/api/share", (request, response) => {

    let buffer = ""
    request.on("data", chunk => {
        if (buffer.length + chunk.length > maxSize) {
            return response.send(500, { error: `Code longer than ${maxSize} bytes` })
        }
        buffer += chunk
    })

    request.on("end", async () => {
       const snippetId = await storage.save(makeSnippet(buffer))
       response.send({ snippetId })
    })
    
})

app.use("/", express.static("./frontend"))

const server = app.listen(2080, () => console.log("Server running..."))

process.on('SIGTERM', () => process.exit())
