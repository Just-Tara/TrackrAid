import React, { useEffect, useState } from "react";

function BalanceCircle({ income, expenses }) {
  const [progress, setProgress] = useState(0);
  const remaining = income - expenses;
  const percentLeft = income > 0 ? Math.max((remaining / income) * 100, 0) : 0;

  useEffect(() => {
    setProgress(0);
    let start = 0;
    let rafId;
    const step = () => {
      start += 1.5;
      if (start <= percentLeft) {
        setProgress(Math.round(start));
        rafId = requestAnimationFrame(step);
      } else {
        setProgress(Math.round(percentLeft));
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [percentLeft]);

  const color =
    progress > 66 ? "#22c55e" : progress > 33 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex items-center justify-center w-[72px] h-[72px] rounded-full"
        style={{
          background: `conic-gradient(${color} ${progress}%, #e5e7eb ${progress}%)`,
        }}
      >
        <div className="flex flex-col items-center justify-center w-[58px] h-[58px] rounded-full bg-white dark:bg-gray-800 shadow-inner">
          <span className="font-bold text-sm text-gray-800 dark:text-white leading-tight">
            {progress}%
          </span>
        </div>
      </div>
      <p className="text-[10px] font-medium text-gray-400 text-center leading-tight">
        saved
      </p>
    </div>
  );
}

export default BalanceCircle;