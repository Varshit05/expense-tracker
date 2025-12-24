const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); 

const connectDb = require("./db/db");
const userRouter = require("./router/userRouter");
const expenseRouter = require("./router/expenseRouter");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://expense-tracker-gamma-mauve.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));

app.options("*", cors());   

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Expense Tracker API is running 🚀");
});

app.use("/auth", userRouter);
app.use("/expenses", expenseRouter);

connectDb();

const port = process.env.PORT_NO || 4000; 

app.listen(port, () => {
  console.log(`🚀 Server on :- ${port}`);
});
