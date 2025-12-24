import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Items from "../components/Items";
import { Chartss } from "../components/Chartss";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import LoadingBar from "react-top-loading-bar";
import { createExpense, getUserExpenses } from "../utils/renders";
import NavBar from "../components/NavBar";

function Home() {
  const navigate = useNavigate();
  const ref = useRef(null);

  // STATES
  const [selectDate, setSelectedDate] = useState(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [userexp, setUserexp] = useState([]);

  // USER DATA (SAFE PARSE)
  const [userdata] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("User"));
    } catch {
      return null;
    }
  });

  document.title = "Home";

  // FETCH USER EXPENSES
  useEffect(() => {
    if (!userdata?._id) {
      navigate("/login");
      return;
    }

    const fetchExpenses = async () => {
      try {
        ref.current?.continuousStart();
        const data = await getUserExpenses(userdata._id);
        setUserexp(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setUserexp([]);
      } finally {
        ref.current?.complete();
      }
    };

    fetchExpenses();
  }, [userdata?._id, navigate]);

  // TOTAL EXPENSE
  const getTotal = () => {
    return userexp.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  // CREATE EXPENSE
  const handleCreateExpense = async () => {
    if (!amount || !category || !selectDate) return;

    const expInfo = {
      usersid: userdata._id,
      category,
      date: selectDate,
      amount: Number(amount),
    };

    try {
      ref.current?.continuousStart();
      await createExpense(expInfo);

      // REFRESH LIST AFTER CREATE
      const data = await getUserExpenses(userdata._id);
      setUserexp(Array.isArray(data) ? data : []);

      // RESET FORM
      setAmount("");
      setCategory("");
      setSelectedDate(null);
    } catch (error) {
      console.error("Error creating expense:", error);
    } finally {
      ref.current?.complete();
    }
  };

  return (
    <div className="h-screen font-mont w-full bg-zinc-900">
      <LoadingBar color="orange" ref={ref} />

      <NavBar data={userexp} />

      <div className="Feed w-4/5 left-[calc(100%-90%)] relative h-[calc(100%-6rem)] flex">
        {/* LEFT SIDE */}
        <div className="leftbox w-1/2 h-full">
          <div className="p-6 h-full w-full">
            <Chartss exdata={userexp} />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="rightbox flex flex-col gap-10 items-center w-1/2">
          {/* CREATE TRANSACTION */}
          <div className="bg-gray-800 rounded-3xl p-10 flex flex-col gap-4 mt-5">
            <div className="font-bold text-3xl text-white text-center">
              Create Transaction
            </div>

            <div className="flex gap-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="h-12 p-4 rounded-xl outline-none"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl p-2.5 outline-none"
              >
                <option value="">--Select--</option>
                <option value="Grocery">Grocery</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Shopping">Shopping</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Fun">Fun</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <DatePicker
              selected={selectDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Select Date"
              className="p-3 rounded-xl outline-none"
              showYearDropdown
            />

            <button
              onClick={handleCreateExpense}
              className="rounded-xl px-5 py-2 text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Add Expense
            </button>
          </div>

          {/* EXPENSE LIST */}
          <div className="w-5/6 p-7 rounded-xl border-white border-2 grid gap-7 overflow-y-scroll">
            <div className="text-3xl text-white font-bold">
              Total Expense : ₹ {getTotal()}
            </div>

            <div className="grid grid-cols-2 gap-7">
              {userexp.map((item) => (
                <Items key={item._id} data={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
