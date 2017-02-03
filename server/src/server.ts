import * as express from 'express'
const app = express()

app.get("/api", (request, response) => {
    response.send("Hello world")
})

app.use("/", express.static("/frontend"))
app.listen(2080, () => console.log("Server running..."))
