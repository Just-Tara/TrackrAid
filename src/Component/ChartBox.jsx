import React, { useMemo } from "react";
import {
  PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useTransactions } from "../Context/TransactionContext";
import BarChartComponent from "./BarChart";

const COLORS = ["#22c55e", "#ef4444"];

function GhostPie() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-[160px] h-[160px] rounded-full  border-[28px] border-gray-200 dark:border-gray-700 opacity-50" />
      <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <p className="text-xs text-gray-400">Add transactions to see the ratio</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-3 py-2 text-sm border border-gray-100 dark:border-gray-700">
        <p className="font-semibold text-gray-700 dark:text-white">{payload[0].name}</p>
        <p className="text-gray-500 dark:text-gray-400">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

function ChartBox() {
  const { transactions } = useTransactions();

  const { totalIncome, totalExpense } = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { totalIncome: income, totalExpense: expense };
  }, [transactions]);

  const hasData = totalIncome > 0 || totalExpense > 0;

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <div className="hidden lg:flex flex-col absolute right-0 top-0 h-full w-[24%] overflow-y-auto bg-gray-100 dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 p-5 items-center gap-2">
      {/* Pie */}
      <div className="w-full">
        <h2 className="text-sm font-bold text-gray-700 dark:text-white mb-4 uppercase tracking-wide">
          Income vs Expense
        </h2>

        {hasData ? (
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RePieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center py-4">
            <GhostPie />
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center gap-5 mt-1">
          {[
            { label: "Income", color: COLORS[0], value: totalIncome },
            { label: "Expense", color: COLORS[1], value: totalExpense },
          ].map(({ label, color, value }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-white">
                ${value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-gray-100 dark:border-gray-800 my-3" />

      {/* Bar Chart */}
      <div className="w-full flex-1 min-h-[200px]">
        <BarChartComponent />
      </div>
    </div>
  );
}

export default ChartBox;