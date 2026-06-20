import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTransactions } from "../Context/TransactionContext";
import { ArrowLeft } from "lucide-react";


function FullTransaction() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions } = useTransactions();

  const transaction = transactions.find(
  (t) => (t._id || t.id)?.toString() === id
  );

  if (!transaction) {
    return (
      <div className="p-5 text-center">
        <p>Transaction not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
   <div className="p-6 bg-[#f2f2f2] min-h-screen dark:bg-gray-900 dark:text-white lg:w-[50%] lg:mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-5 text-blue-500"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="bg-white dark:bg-gray-950 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-3">{transaction.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          <strong>Date:</strong> {transaction.date}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          <strong>Time:</strong> {transaction.time}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          <strong>Type:</strong> {transaction.type}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          <strong>Amount:</strong>{" "}
          <span
            className={`font-bold ${
              transaction.type === "income"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            ${transaction.amount}
          </span>
        </p>
        {transaction.note && (
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> {transaction.note}
          </p>
        )}
      </div>
    </div>
  );
}

export default FullTransaction;