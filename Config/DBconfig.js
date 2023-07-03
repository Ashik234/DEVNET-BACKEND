const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connection sucessfull")
}).catch(err => console.log("Error connecting to DB" + err))