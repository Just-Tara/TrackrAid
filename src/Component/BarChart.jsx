import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart as ReBarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { useTransactions } from "../Context/TransactionContext";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { amount, percentage } = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow px-3 py-2 text-xs border border-gray-100 dark:border-gray-700">
        <p className="font-semibold text-gray-700 dark:text-white">${amount.toFixed(2)}</p>
        <p className="text-gray-400">{percentage.toFixed(1)}% of income</p>
      </div>
    );
  }
  return null;
};

function GhostBars() {
  const ghostHeights = [30, 55, 40, 70, 45, 60, 35];
  return (
    <div className="flex flex-col items-center w-full gap-3">
      <div className="flex items-end gap-2 w-full h-[120px] px-2">
        {ghostHeights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gray-200 dark:bg-gray-700 opacity-50"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex gap-2 w-full px-2">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-gray-300 dark:text-gray-600">{d}</div>
        ))}
      </div>
      <p className="text-xs text-gray-400">No expense data yet</p>
    </div>
  );
}

function BarChartComponent() {
  const { transactions } = useTransactions();
  const [isCompact, setIsCompact] = useState(window.innerWidth < 1440);

  useEffect(() => {
    const handleResize = () => setIsCompact(window.innerWidth < 1440);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const weeklyData = useMemo(() => {
    const dataMap = days.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});
    let totalIncome = 0;

    transactions.forEach((t) => {
      if (t.type === "income") totalIncome += Number(t.amount);
      if (t.type === "expense") {
        const dayIndex = new Date(t.date).getDay();
        dataMap[days[dayIndex]] += Number(t.amount);
      }
    });

    totalIncome = totalIncome || 1;

    return days.map((day) => ({
      day,
      amount: dataMap[day],
      percentage: dataMap[day] > 0 ? (dataMap[day] / totalIncome) * 100 : 0.5,
    }));
  }, [transactions]);

  const hasExpenses = weeklyData.some((d) => d.amount > 0);
  const today = days[new Date().getDay()];

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <h2 className="text-sm font-bold text-gray-700 dark:text-white uppercase tracking-wide">
        Weekly Spending
      </h2>

      {!hasExpenses ? (
        <GhostBars />
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <ReBarChart data={weeklyData} barCategoryGap="20%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={(v) => {
                if (isCompact) return v === "Thu" ? "Th" : v.charAt(0);
                return v;
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
            <Bar dataKey="percentage" radius={[5, 5, 0, 0]} barSize={isCompact ? 18 : 26}>
              {weeklyData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.day === today ? "#2563eb" : "#bfdbfe"}
                />
              ))}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default BarChartComponent;