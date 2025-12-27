import connect from './config/dbconnect.js'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

await connect()
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
