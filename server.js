const express = require("express");
const app = express();
const PORT = 3200
const connectDB = require("./config/db")
const userRouter = require("./routes/user.routes")

connectDB();
app.use(express.json());
app.use("/api/user",userRouter)

app.get("/",(req,res)=>{
    res.send("server runs successfully!")
})

app.listen(PORT,()=>{
    console.log(`server runs on PORT - ${PORT}`)
})