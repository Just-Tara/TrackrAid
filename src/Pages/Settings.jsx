import { useContext, useState } from "react";
import { ThemeContext } from "../Context/ThemeContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faTrash, faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Sun, Moon, ChevronRight, Trash2 } from "lucide-react";
import { deleteAllTransactions, exportData } from "../api.js";
import { useTransactions } from "../Context/TransactionContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { useCurrency } from "../Context/CurrencyContext.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";

function getUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return { name: "User", email: "", initials: "U" };
    const user = JSON.parse(raw);
    const name = user?.name || user?.username || "User";
    const email = user?.email || "";
    const initials = name.slice(0, 2).toUpperCase();
    const picture = user?.picture || null;
    return { name, email, initials, picture };
  } catch {
    return { name: "User", email: "", initials: "U" };
  }
}

function ResetModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-[80%] max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Trash2 size={22} className="text-red-500" />
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white text-center">Reset All Data?</h2>
          <p className="text-sm text-gray-400 text-center">
            This will permanently delete all your transactions and cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [showResetModal, setShowResetModal] = useState(false);
  const { fetchTransactions } = useTransactions();
  const user = getUser();
  const { currency, setCurrency } = useCurrency();

  const handleReset = async () => {
    try {
      const res = await deleteAllTransactions();
      if (res?.success) {
        setShowResetModal(false);
        await fetchTransactions();
      } else {
        toast.error("Failed to reset data.");
      }
    } catch (error) {
      console.error("Error resetting data:", error);
      toast.error("Failed to reset data. Please try again.");
    }
  };
    const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const token = localStorage.getItem("token");
      const res = await exportData(token);

      const transactions = res.data.transactions || [];

      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.text("TrackrAid Financial Report", 14, 20);

      doc.setFontSize(11);
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        14,
        30
      );

      autoTable(doc, {
        startY: 40,
        head: [["Title", "Category", "Type", "Amount", "Date"]],
        body: transactions.map((t) => [
          t.title,
          t.category,
          t.type,
          formatCurrency(t.amount, currency),
          new Date(t.date).toLocaleDateString(),
        ]),
      });

      doc.save(`TrackrAid_Report_${Date.now()}.pdf`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="p-5 pb-28 lg:pb-5 bg-[#f2f2f2] dark:bg-gray-900 dark:text-white lg:w-[50%] lg:mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">Settings</h1>

      {/* User Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-6 flex items-center gap-4">
        {user.picture ? (
          <img src={user.picture} alt="avatar" className="w-14 h-14 rounded-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow">
            {user.initials}
          </div>
        )}
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
          {user.email && <p className="text-sm text-gray-400">{user.email}</p>}
        </div>
      </div>

      {/* Appearance */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 pl-1 mb-2">Appearance</p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon size={17} className="text-blue-400" /> : <Sun size={17} className="text-yellow-500" />}
            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {theme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
          </div>
          {/* Toggle switch */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              theme === "dark" ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${
                theme === "dark" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Currency */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 pl-1 mb-2">Currency</p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-sm font-medium text-gray-800 dark:text-white">Display Currency</span>
          <div className="flex items-center gap-2">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-sm text-gray-500 dark:text-gray-400 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="NGN">NGN (₦)</option>
            </select>
            <ChevronRight size={15} className="text-gray-300" />
          </div>
        </div>
      </div>

      {/* Data Management */}
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 pl-1 mb-2">Data Management</p>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-6 overflow-hidden">
        <button
          onClick={() => setShowResetModal(true)}
          className="w-full flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <FontAwesomeIcon icon={faTrash} className="text-red-500 text-xs" />
            </div>
            <span className="text-sm font-medium text-red-500">Reset All Data</span>
          </div>
          <ChevronRight size={15} className="text-gray-300" />
        </button>

        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center justify-between px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FontAwesomeIcon
                  icon={faArrowUpFromBracket}
                  className="text-blue-500 text-xs"
                />
              )}
            </div>

            <span className="text-sm font-medium text-gray-800 dark:text-white">
              {isExporting ? "Generating PDF..." : "Export Data"}
            </span>
          </div>

          <ChevronRight size={15} className="text-gray-300" />
        </button>
      </div>

      {/* Logout */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5"
        >
          <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <FontAwesomeIcon icon={faRightFromBracket} className="text-gray-500 text-xs" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Log Out</span>
        </button>
      </div>

      {showResetModal && (
        <ResetModal
          onCancel={() => setShowResetModal(false)}
          onConfirm={handleReset}
        />
      )}
    </div>
  );
}