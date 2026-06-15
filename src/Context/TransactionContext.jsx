import { createContext, useContext, useState, useEffect } from "react";
import {
  getTransactions,
  createTransaction as createAPI,
  deleteTransaction as deleteAPI,
  deleteAllTransactions as deleteAllAPI,
} from "../api";

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  //  CENTRAL FETCH FUNCTION 
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await getTransactions(token);

      if (res.success) {
        // backend returns res.data (array)
        setTransactions(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on load
  useEffect(() => {
    fetchTransactions();
  }, []);

  //  CREATE (NOW REFRESHES FROM BACKEND)
  const addTransaction = async (transaction) => {
    const token = localStorage.getItem("token");

    const res = await createAPI(transaction, token);

    if (res.success) {
        await  fetchTransactions();
    }
  };

  // DELETE 
  const deleteTransaction = async (id) => {
    const token = localStorage.getItem("token");

    await deleteAPI(id, token);

    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  // DELETE ALL 
  const deleteAllTransactions = async () => {
    const token = localStorage.getItem("token");

    await deleteAllAPI(token);

    setTransactions([]);
  };    

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        fetchTransactions,
        loading,
        deleteAllTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);