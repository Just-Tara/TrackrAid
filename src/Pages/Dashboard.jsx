 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons'
import {faArrowUp} from '@fortawesome/free-solid-svg-icons'
import BalanceCircle from "../Component/BalanceCircle";
import { useTransactions } from '../Context/TransactionContext'; 
import { useNavigate } from "react-router-dom";
import {Plus} from "lucide-react"
import DesktopDashboard from './DesktopDashboard';
import {useEffect, useState} from "react";



function Dashboard() {
   const { transactions, loading } = useTransactions();
  const navigate = useNavigate();

  if (loading) {
    return <p className="text-center mt-10">Loading transactions...</p>;
  }

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expenses; 
    return(
        <>
            <div className="min-h-screen p-5 bg-[#f2f2f2] lg:w-[50%] lg:mx-auto dark:bg-gray-900 dark:text-white block lg:hidden">
                        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                        <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="bg-[#d7f8df] rounded-[14px]  p-4 text-black dark:text-white dark:bg-[#153f25]">
                    <div className="mt-1 flex justify-between"><p className=" dark:text-[#69f0ae] text-[#1e8449] text-[17px] font-semibold mb-1">Income</p> <FontAwesomeIcon className="text-white dark:text-[#69f0ae] mt-1 bg-[#1e8449] rounded-full p-[2px] font-bold text-[10px]" icon={faArrowDown} /></div>
                            <p className="font-bold text-[20px]">${income.toFixed(2)}</p>
                    </div>
                    <div className="bg-[#fddede] dark:bg-[#3d1818] rounded-[14px] p-4 text-black dark:text-white">
                            <div className="mt-1 flex justify-between" ><p className="text-[17px] text-[#c0392b] dark:text-[#ff5252] font-semibold mb-1">Expenses</p> <FontAwesomeIcon className="text-white  mt-1 bg-[#c0392b] dark:bg-[#ff5252]0 rounded-full p-[2px] font-bold text-[10px]" icon={faArrowUp} /></div>
                            <p className="font-bold text-[20px]">${expenses.toFixed(2)}</p>
                    </div>
                        
                    </div>
                    <div className="flex justify-between p-4 bg-gray-200 dark:bg-gray-800  rounded-[14px] mt-3 ">
                        <div className=''>
                            <h1 className='font-semibold text-black dark:text-white mb-1'>Current balance</h1>
                            <p className='font-bold text-2xl text-black dark:text-white'>${balance.toFixed(2)}</p>
                    </div>
                    <div>
                        <BalanceCircle income={income} expenses={expenses}/>
                    </div>
                    </div>
                    
                    <div className="mt-3">
                        <div className="flex justify-between">
                            <h1 className='font-bold text-[17px]'>Recent Transaction</h1>
                            <p className='text-blue-500 cursor-pointer' onClick={() => navigate("/transactions")}>See All</p>
                        </div>
                        <div className="rounded-md mt-3 border-white">
                        {transactions.length === 0 ? (
                            <p className="p-3 text-gray-500 text-center text-sm">No transactions yet. 
                            <br></br> Create your first transaction</p>
                        ) : (
                            [...transactions]
                            .sort((a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)).slice(0, 3).map((t) => (
                            <div 
                                key={t.id}
                                className="flex mb-1 justify-between items-center border-white bg-white rounded-[10px] px-3 py-2 dark:bg-gray-950">
                                
                                    <div className="flex gap-3 items-center">
                                    <div><p className={`text-gray-800 p-2 rounded-[15px] ${t.type === "income" ? "bg-green-200" : "bg-red-200"}`}>
                                        {t.icon}
                                        </p>
                                    </div>
                                    <div>
                                    <p className="font-medium">{t.title || "Untitled"}</p>
                                    <p className="text-sm text-gray-500">{t.date} at {t.time}</p>
                                    </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                    <p className={`font-bold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                                        {t.type === "income" ? "+" : "-"}${t.amount}</p>
                                    </div>
                                </div>
                                
                            ))
                        )}
                        </div>

                    </div>
                    <button onClick={() => navigate("/add-transaction")} className="fixed bottom-23 right-3 bg-blue-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-400"><Plus size={28}/></button>
            </div>

            <DesktopDashboard/>
       
        </>
    )

}
export default Dashboard;