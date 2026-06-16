import React from "react";


function TrackrAidLogo({ variant = "full", size = 40, className = "" }) {
  const Icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Squircle badge */}
      <rect width="40" height="40" rx="12" fill="#2563eb" />

      {/* Checkmark path */}
      <path
        d="M9 24 L15 18 L20 22 L31 11"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Checkmark tail accent */}
      <path
        d="M27 11 H31 V15"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Peak marker — green dot, echoes "income" accent color */}
      <circle cx="20" cy="22" r="2.5" fill="#4ade80" />

      {/* Base line — subtle horizon */}
      <path
        d="M9 28 H31"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );

  const Wordmark = (
    <span
      className="font-bold tracking-tight text-gray-900 dark:text-white"
      style={{ fontSize: size * 0.55 }}
    >
      Trackr<span className="text-blue-600 dark:text-blue-400">Aid</span>
    </span>
  );

  if (variant === "icon") {
    return <div className={className}>{Icon}</div>;
  }

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        {Icon}
        {Wordmark}
      </div>
    );
  }

  // "full" — icon + wordmark side by side
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {Icon}
      {Wordmark}
    </div>
  );
}

export default TrackrAidLogo;