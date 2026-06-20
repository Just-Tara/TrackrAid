import {
  faMoneyBillWave, faGift, faChartLine, faBriefcase,
  faEllipsisH, faHome, faBurger, faCartShopping, faBus, faBox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import BalanceCircle from "../Component/BalanceCircle";
import { useTransactions } from "../Context/TransactionContext";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import DesktopDashboard from "./DesktopDashboard";
import { useCurrency } from "../Context/CurrencyContext";
import { formatCurrency } from "../utils/formatCurrency";
import {getSummary} from "../api"
import { useState, useEffect } from "react";


const iconMap = {
  money: faMoneyBillWave, gift: faGift, chart: faChartLine,
  briefcase: faBriefcase, more: faEllipsisH, home: faHome,
  food: faBurger, cart: faCartShopping, bus: faBus, box: faBox,
};

function getUserInitials() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "U";
    const user = JSON.parse(raw);
    const name = user?.name || user?.username || user?.email || "";
    return name.slice(0, 2).toUpperCase() || "U";
  } catch {
    return "U";
  }
}

function getUserName() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "there";
    const user = JSON.parse(raw);
    return user?.name || user?.username || "there";
  } catch {
    return "there";
  }
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function EmptyTransactions() {
  return (
    <div className="flex flex-col items-center justify-center py-4 gap-1">
      {[80, 60, 70].map((w, i) => (
        <div key={i} className="flex justify-between items-center w-full bg-gray-100 dark:bg-gray-800/50 rounded-xl px-4 py-3 mb-1 opacity-50">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="flex flex-col gap-1">
              <div className="h-2.5 rounded bg-gray-200 dark:bg-gray-700" style={{ width: w }} />
              <div className="h-2 w-16 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="h-2.5 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
      <p className="text-sm text-gray-400 mt-2">No transactions yet — add your first one</p>
    </div>
  );
}

function Dashboard() {
  const { transactions, loading } = useTransactions();
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await getSummary();
        if (res.success) {
          setSummary(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchSummary();
  }, [transactions]); 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f2f2f2] dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading your finances…</p>
        </div>
      </div>
    );
  }

  const income = summary.totalIncome;
  const expenses = summary.totalExpense;
  const balance = summary.balance;
    

  const sorted = [...transactions]
    .sort((a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time))
    .slice(0, 3);

  const initials = getUserInitials();
  const name = getUserName();

  return (
    <>
      {/* Mobile */}
      <div className="min-h-screen p-5 pb-28 bg-[#f2f2f2] dark:bg-gray-900 dark:text-white block lg:hidden">

        {/* Greeting header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{getGreeting()},</p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
            </div>
          </div>
          <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow">
            {initials}
          </div>
        </div>
    

        {/* Income / Expense */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#d7f8df] dark:bg-[#153f25] rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#1e8449] dark:text-[#69f0ae]">Income</p>
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1e8449] shadow">
                <FontAwesomeIcon icon={faArrowDown} className="text-white text-[9px]" />
              </span>
            </div>
            <p className="font-bold text-xl text-gray-900 dark:text-white">{formatCurrency(income, currency)}</p>
          </div>

          <div className="bg-[#fddede] dark:bg-[#3d1818] rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#c0392b] dark:text-[#ff5252]">Expenses</p>
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#c0392b] shadow">
                <FontAwesomeIcon icon={faArrowUp} className="text-white text-[9px]" />
              </span>
            </div>
            <p className="font-bold text-xl text-gray-900 dark:text-white">{formatCurrency(expenses, currency)}</p>
          </div>
        </div>

        {/* Balance */}
        <div className="flex justify-between items-center p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Current Balance</p>
            <p className="font-bold text-2xl text-gray-900 dark:text-white">{formatCurrency(balance, currency)}</p>
            <p className={`text-xs mt-1 font-medium ${balance >= 0 ? "text-green-500" : "text-red-500"}`}>
              {balance >= 0 ? "You're in the green" : "Spending exceeds income"}
            </p>
          </div>
          <BalanceCircle income={income} expenses={expenses} />
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-base text-gray-900 dark:text-white">Recent Transactions</h2>
            <button
              onClick={() => navigate("/transactions")}
              className="flex items-center gap-1 text-blue-500 text-sm font-medium"
            >
              See All <ArrowRight size={14} />
            </button>
          </div>

          {transactions.length === 0 ? (
            <EmptyTransactions />
          ) : (
            sorted.map((t) => (
              <div
                key={t._id || t.id}
                className="flex mb-2 justify-between items-center bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm"
              >
                <div className="flex gap-3 items-center">
                  <span className={`p-2 rounded-xl ${t.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                    <FontAwesomeIcon
                      icon={iconMap[t.icon] || faEllipsisH}
                      className={t.type === "income" ? "text-green-600" : "text-red-500"}
                    />
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">{t.title || "Untitled"}</p>
                    <p className="text-xs text-gray-400">{t.date} · {t.time}</p>
                  </div>
                </div>
                <p className={`font-bold text-sm ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount, currency)}
                </p>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/add-transaction")}
          className="fixed bottom-24 right-4 bg-blue-500 text-white p-4 rounded-full shadow-xl hover:bg-blue-400 transition-colors z-50"
        >
          <Plus size={24} />
        </button>
      </div>

      
      <DesktopDashboard />
    </>
  );
}

export default Dashboard;