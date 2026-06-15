import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass, faMoneyBillWave, faGift, faChartLine,
  faBriefcase, faEllipsisH, faHome, faBurger, faCartShopping,
  faBus, faBox,
} from "@fortawesome/free-solid-svg-icons";
import { useTransactions } from "../Context/TransactionContext";

const iconMap = {
  money: faMoneyBillWave, gift: faGift, chart: faChartLine,
  briefcase: faBriefcase, more: faEllipsisH, home: faHome,
  food: faBurger, cart: faCartShopping, bus: faBus, box: faBox,
};

const FILTERS = ["All", "Income", "Expense"];

function EmptyState({ isFiltered }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      {[90, 65, 75].map((w, i) => (
        <div key={i} className="flex justify-between items-center w-full bg-gray-100 dark:bg-gray-800/40 rounded-xl px-4 py-3 opacity-40">
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="flex flex-col gap-1.5">
              <div className="h-2.5 rounded bg-gray-200 dark:bg-gray-700" style={{ width: w }} />
              <div className="h-2 w-20 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
          <div className="h-2.5 w-14 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      ))}
      <p className="text-sm text-gray-400 mt-2 text-center">
        {isFiltered ? "No transactions match your search" : "No transactions yet — tap + to add your first one"}
      </p>
    </div>
  );
}

function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[80%] max-w-sm p-6">
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Trash2 size={22} className="text-red-500" />
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Delete Transaction?</h2>
          <p className="text-sm text-gray-400 text-center">This action can't be undone.</p>
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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function TransactionItem({ t, onDelete, onClick }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div
        className="flex mb-2 justify-between items-center cursor-pointer bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
        onClick={onClick}
      >
        <div className="flex gap-3 items-center">
          <span className={`p-2.5 rounded-xl ${t.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
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
        <div className="flex items-center gap-3">
          <p className={`font-bold text-sm ${t.type === "income" ? "text-green-600" : "text-red-500"}`}>
            {t.type === "income" ? "+" : "-"}${Number(t.amount).toFixed(2)}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {showConfirm && (
        <DeleteConfirmModal
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => { setShowConfirm(false); await onDelete(); }}
        />
      )}
    </>
  );
}

function TransactionPage() {
  const navigate = useNavigate();
  const { transactions, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = transactions
    .filter((t) => {
      const matchesSearch =
        (t.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (t.date?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (t.amount?.toString() || "").includes(searchTerm);
      const matchesFilter = activeFilter === "All" || t.type === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time));

  const isFiltered = searchTerm.length > 0 || activeFilter !== "All";

  return (
   <div className="p-5 pb-28 lg:pb-5 bg-[#f2f2f2] dark:bg-gray-900 dark:text-white lg:w-[50%] lg:mx-auto min-h-screen">
      <h1 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">Transactions</h1>

      {/* Search */}
      <div className="mb-4 flex gap-2 items-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-3 shadow-sm">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 text-sm" />
        <input
          type="text"
          placeholder="Search by name, date or amount…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 h-[42px] text-sm focus:outline-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600 text-xs px-1">✕</button>
        )}
      </div>

      {/* Filter tabs + count */}
      <div className="flex gap-2 mb-5 items-center">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === f
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState isFiltered={isFiltered} />
      ) : (
        filtered.map((t) => (
          <TransactionItem
            key={t._id || t.id}
            t={t}
            onDelete={() => deleteTransaction(t._id || t.id)}
            onClick={() => navigate(`/full-transaction/${t._id || t.id}`)}
          />
        ))
      )}

      {/*add transaction button */}
      <button
        onClick={() => navigate("/add-transaction")}
        className="fixed bottom-24 right-4 lg:bottom-8 lg:right-[calc(26%+2rem)] bg-blue-500 text-white p-4 rounded-full shadow-xl hover:bg-blue-400 active:scale-95 transition-all z-50"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}

export default TransactionPage;