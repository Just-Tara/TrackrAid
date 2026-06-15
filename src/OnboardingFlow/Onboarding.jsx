import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  faListUl, faChartPie, faShieldHalved, faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrackrAidLogo from "../Component/TrackrAidLogo";

const SLIDES = [
  {
    icon: faListUl,
    color: "blue",
    title: "Track every transaction",
    description:
      "Log income and expenses in seconds. Categorize with icons so your activity is easy to scan at a glance.",
  },
  {
    icon: faChartPie,
    color: "green",
    title: "See your money clearly",
    description:
      "Visual breakdowns show exactly where your money goes — income vs expenses, and spending trends by day.",
  },
  {
    icon: faShieldHalved,
    color: "blue",
    title: "Stay in control",
    description:
      "Watch your savings ring fill up as you spend less than you earn. Your balance, always one glance away.",
  },
];

const COLOR_MAP = {
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-600",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
};

function IllustrationRing({ color }) {
  const stroke = color === "green" ? "#22c55e" : "#2563eb";
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
      <circle cx="90" cy="90" r="78" fill="none" stroke="#e5e7eb" strokeWidth="14" />
      <circle
        cx="90" cy="90" r="78" fill="none"
        stroke={stroke} strokeWidth="14" strokeLinecap="round"
        strokeDasharray="320 490"
        transform="rotate(-90 90 90)"
      />
    </svg>
  );
}

function Slide({ slide, active }) {
  const colors = COLOR_MAP[slide.color];
  return (
    <div className={`flex flex-col items-center text-center px-6 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}>
      <div className="relative mb-6">
        <IllustrationRing color={slide.color} />
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className={`w-20 h-20 rounded-2xl ${colors.bg} flex items-center justify-center`}>
            <FontAwesomeIcon icon={slide.icon} className={`${colors.text} text-3xl`} />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{slide.title}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-sm">
        {slide.description}
      </p>
    </div>
  );
}

function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const isLast = step === SLIDES.length - 1;

  const finishOnboarding = () => {
    localStorage.removeItem("needsOnboarding");
    navigate("/dashboard");
  };

  const handleNext = () => {
    if (isLast) {
      finishOnboarding();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    finishOnboarding();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f2] dark:bg-gray-900 dark:text-white">

      {/* Mobile layout */}
      <div className="flex flex-col h-screen lg:hidden">
        <div className="flex justify-between items-center p-5 pt-8">
          <TrackrAidLogo size={32} />
          {!isLast && (
            <button onClick={handleSkip} className="text-sm text-gray-400 font-medium">
              Skip
            </button>
          )}
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Slide slide={SLIDES[step]} active={true} />
        </div>

        <div className="p-6 pb-10">
          <div className="flex justify-center gap-2 mb-6">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-blue-500" : "w-1.5 bg-gray-300 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors active:scale-[0.98]"
          >
            {isLast ? "Get Started" : "Next"}
            <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
          </button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:flex h-screen">
        <div className="w-[45%] bg-blue-600 flex flex-col justify-between p-12 text-white">
          <TrackrAidLogo size={36} className="[&_span]:text-white" />

          <div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Take control of<br />your finances
            </h1>
            <p className="text-blue-100 text-sm max-w-md leading-relaxed">
              TrackrAid helps you log transactions, visualize spending patterns,
              and build healthier financial habits — one entry at a time.
            </p>
          </div>

          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-8 bg-white" : "w-1.5 bg-blue-400"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="w-[55%] flex flex-col items-center justify-center p-12 relative">
          {!isLast && (
            <button
              onClick={handleSkip}
              className="absolute top-8 right-8 text-sm text-gray-400 font-medium hover:text-gray-600 dark:hover:text-gray-300"
            >
              Skip
            </button>
          )}

          <div className="max-w-md w-full">
            <Slide slide={SLIDES[step]} active={true} />

            <button
              onClick={handleNext}
              className="w-full mt-8 bg-blue-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors active:scale-[0.98]"
            >
              {isLast ? "Get Started" : "Next"}
              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </button>

            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="w-full mt-3 text-gray-400 text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;