const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // ✅ MUST be at the top

const connectDb = require("./db/db");
const userRouter = require("./router/userRouter");
const expenseRouter = require("./router/expenseRouter");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-name.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running 🚀");
});


app.use("/auth", userRouter);
app.use("/expenses", expenseRouter);

// Connect DB
connectDb();

const port = process.env.PORT_NO || 4000; // ✅ correct fallback

app.listen(port, () => {
  console.log(`🚀 Server on :- ${port}`);
});
