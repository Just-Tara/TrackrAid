import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3500",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// LOGIN
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// SIGNUP
export const signupUser = async (data) => {
  const res = await API.post("/auth/signup", data);
  return res.data;
};

// GET TRANSACTIONS

export const getTransactions = async () => {
  const res = await API.get("/transactions");
  return res.data;
};

export const createTransaction = async (data) => {
  const res = await API.post("/transactions", data);
  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await API.delete(`/transactions/${id}`);
  return res.data;
};
export const deleteAllTransactions = async () => {
  const res = await API.delete("/transactions");
  return res.data;
}
export const exportData = async (token) => {
  const res = await API.get('/transactions/export', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}