import express from "express"
import cors from "cors"
import { postRouter } from "./routes/index.mjs"

const app = express()
const port = 3000

app.use(cors())          
app.use(express.json())

app.get("/", (req, res) => {
  res.send("hello world")
})

app.use("/api/v1", postRouter)

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})