const express = require("express")
const dbConfig = require("./Config/DBconfig")
const cors = require("cors")
require('dotenv').config();
const UserRoutes = require('../Server/Routes/userRoutes')
const AdminRoutes = require('../Server/Routes/adminRoutes')
const app = express()
app.use(express.json())

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}))

app.use("/", UserRoutes)
app.use("/admin",AdminRoutes)

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server Started Running On Port ${port}`);
})

