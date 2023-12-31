const express = require("express");
const app = express();
const dbConfig = require("./Config/DBconfig");
const cors = require("cors");
require("dotenv").config();
const server = require("http").createServer(app);
const { configureSocket } = require("./Config/Socket");
const UserRoutes = require("./Routes/userRoutes");
const AdminRoutes = require("./Routes/adminRoutes");
app.use(express.json());

// socket setup
configureSocket(server);
app.use(
  cors({
    origin: ["http://localhost:5173","https://devnetapp.netlify.app","https://devnetapp.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/", UserRoutes);
app.use("/admin", AdminRoutes);

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server Started Running On Port ${port}`);
});
