import express from "express"
import { postRouter } from "./routes/index.mjs"

const app = express()
const port = 3000

app.use(express.json())

app.get("/", (req, res, next) => {
    res.send("hello world")})

app.use("/api/v1", postRouter)

app.listen(port, () => console.log(`server is running...${port}`))