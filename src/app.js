const express = require("express");
const userRouter = require("./routes/users.route");

const app = express();
app.use(express.json())

app.use("/users", userRouter);

app.listen("3000", () => {
    console.log("Server is running at port 3000 🟢");
})
