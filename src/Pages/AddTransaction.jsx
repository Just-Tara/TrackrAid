import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTransactions } from "../Context/TransactionContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createTransaction } from "../api";
import {
  faMoneyBillWave,
  faGift,
  faChartLine,
  faBriefcase,
  faEllipsisH,
  faHome,
  faBurger,
  faCartShopping,
  faBus,
  faBox,
} from "@fortawesome/free-solid-svg-icons";
  import { useCurrency } from "../Context/CurrencyContext";
  import { formatCurrency } from "../utils/formatCurrency";

function AddTransaction() {
  const { addTransaction, fetchTransactions } = useTransactions();
  const navigate = useNavigate();

  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { currency } = useCurrency();

  const iconMap = {
    money: faMoneyBillWave,
    gift: faGift,
    chart: faChartLine,
    briefcase: faBriefcase,
    more: faEllipsisH,
    home: faHome,
    food: faBurger,
    cart: faCartShopping,
    bus: faBus,
    box: faBox,
  };

  const categories = {
    income: [
      { label: "Salary", icon: "money" },
      { label: "Gift", icon: "gift" },
      { label: "Investment", icon: "chart" },
      { label: "Side Hustle", icon: "briefcase" },
      { label: "Others", icon: "more" },
    ],
    expense: [
      { label: "Rent", icon: "home" },
      { label: "Food", icon: "food" },
      { label: "Shopping", icon: "cart" },
      { label: "Transportation", icon: "bus" },
      { label: "Others", icon: "box" },
    ],
  };

  const formatDate = (date) => {
    const options = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "2-digit",
    };
    const parts = date.toLocaleDateString("en-GB", options).split(" ");
    return `${parts[1]} ${parts[2]} ${parts[3]}`;
  };

  const now = new Date();
  const currentDate = formatDate(now);
  const currentTime = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });


const [success, setSuccess] = useState("");


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!category || !amount || !title) {
    setError("Please fill all required fields");
    return;
  }
  if (parseFloat(amount) > 1000000) {
  setError("That's above our maximum transaction limit of 1,000,000,000");
  return;
}
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const selectedCategory = categories[type].find(
      (cat) => cat.label === category
    );

    const token = localStorage.getItem("token");

    const newTransaction = {
      type,
      title,
      category: selectedCategory.label,
      icon: selectedCategory.icon,
      amount: parseFloat(amount),
      date: currentDate,
      time: currentTime,
      note,
    };

    const response = await createTransaction(
      newTransaction,
      token
    );

    addTransaction(response.data);
    await fetchTransactions();

    setSuccess("Transaction added successfully");

    setTimeout(() => {
      navigate("/transactions");
    }, 1000);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Failed to create transaction"
    );
  } finally {
    setLoading(false);
  }
};        

  return (
    <div className=" px-10 py-3 bg-[#eee] min-h-screen dark:bg-gray-900 dark:text-white">
      <div className="flex justify-between mt-3 mb-4">
        <button onClick={() => navigate("/transactions")} className="text-blue-400 cursor-pointer">
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`cursor-pointer ${
            !amount || !category ? "text-gray-500" : "text-blue-500"
          }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      <h2 className="text-[27px] font-bold mb-4">Add Transaction</h2>

      {error && (
        <p className="text-red-500 mb-3 text-sm">{error}</p> 
      )}
  
      {success && (
        <p className="text-green-500 mb-3 text-sm">{success}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-white dark:bg-gray-950">
          <div className="p-[4px] rounded-md flex text-sm w-full bg-[#eee] dark:bg-gray-900">
            <button
              type="button"
              className={`cursor-pointer w-1/2 p-[6px] ${
                type === "income" ? "bg-white dark:bg-gray-950" : ""
              }`}
              onClick={() => setType("income")}
            >
              Income
            </button>

            <button
              type="button"
              className={`cursor-pointer w-1/2 p-[6px] ${
                type === "expense" ? "bg-white dark:bg-gray-950" : ""
              }`}
              onClick={() => setType("expense")}
            >
              Expense
            </button>
          </div>
        </div>

        <p className="uppercase pl-3 text-xs text-gray-600">details</p>

        <div className="bg-white rounded-md dark:bg-gray-950">
          <div className="px-3">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-b py-2 border-gray-200 w-full focus:outline-none"
            />
          </div>

          <div className="flex px-3 items-center">
            <span className="font-semibold text-[18px]">
              {formatCurrency(0, currency).charAt(0)}
            </span>

            <input
              type="number"
              placeholder={`Amount (${currency})`}
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseFloat(value) <= 1000000) {
                  setAmount(value);
                }
              }}
              className="px-2 py-2 border-b border-gray-200 w-full focus:outline-none"
            />
          </div>

          <div className="flex justify-between px-3 p-1 font-semibold">
            <p>Date</p>
            <div className="flex gap-2">
              <button type="button" className="bg-[#eee] p-1 rounded-md dark:bg-gray-900">
                {currentDate}
              </button>
              <button type="button" className="bg-[#eee] p-1 rounded-md dark:bg-gray-900">
                {currentTime}
              </button>
            </div>
          </div>
        </div>

        <p className="uppercase pl-3 text-xs text-gray-600">category</p>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full border border-gray-200 bg-white p-2 rounded-md dark:bg-gray-950"
        >
          <option value="">-- Select Category --</option>
          {categories[type].map((cat) => (
            <option key={cat.label} value={cat.label}>
              {cat.label}
            </option>
          ))}
        </select>

        <p className="uppercase pl-3 text-xs text-gray-600">description</p>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="px-3 py-1 bg-white w-full rounded-md h-[100px] focus:outline-none dark:bg-gray-950"
        />
      </form>
    </div>
  );
}

export default AddTransaction;