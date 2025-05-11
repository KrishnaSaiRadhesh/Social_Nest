const express = require('express')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/db")
const app = express()
const authRouter = require("./Routes/AuthRouter")
const dotenv = require("dotenv")

dotenv.config();

const Port = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser())
const corsOptions = {
    origin: "http://localhost:5173",
    credentials:true
}

app.use(cors(corsOptions))


app.use("/api/auth", authRouter)
app.use("/api/user", require("./Routes/UserRoute"))
app.use("/api/posts",require("./Routes/PostRouter"))

app.listen(Port, ()=>{
    connectDB();
    console.log("Server is running")
})