const express = require("express");
const authRouter = require("./authRouter");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://degusar:RollingScope@cluster0.ufekb.mongodb.net/task4?retryWrites=true&w=majority`
    );
    app.listen(PORT, () => console.log(`server started on ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
