import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TrackrAidLogo from "../Component/TrackrAidLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faWallet,
  faShieldHalved,
  faBolt,
  faArrowRight,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: faWallet,
    title: "Track Every Dollar",
    desc: "Log income and expenses in seconds. See exactly where your money goes with clean, organized records.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  },
  {
    icon: faChartLine,
    title: "Visual Insights",
    desc: "Beautiful charts that turn your spending habits into clear, actionable patterns you can actually understand.",
    color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
  },
  {
    icon: faShieldHalved,
    title: "Private & Secure",
    desc: "Your financial data is yours alone. Protected with JWT authentication and encrypted storage.",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  },
  {
    icon: faBolt,
    title: "Lightning Fast",
    desc: "Add a transaction in under 5 seconds. No bloat, no noise — just the tools you need.",
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
  },
];

const stats = [
  { value: "100%", label: "Free to use" },
  { value: "<5s", label: "To log a transaction" },
  { value: "∞", label: "Transactions stored" },
];

// Mini mock UI for mockup section
function MockDashboard() {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-2xl bg-white dark:bg-gray-900 text-xs font-sans">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="text-gray-400 dark:text-gray-500 text-[10px]">trackr-aid.vercel.app/dashboard</span>
        <div className="w-12" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Balance cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Balance", value: "$4,280", color: "text-blue-600 dark:text-blue-400" },
            { label: "Income", value: "$6,500", color: "text-green-600 dark:text-green-400" },
            { label: "Expenses", value: "$2,220", color: "text-red-500 dark:text-red-400" },
          ].map((card) => (
            <div key={card.label} className="rounded-xl bg-gray-50 dark:bg-gray-800 p-2.5 text-center">
              <p className="text-gray-400 dark:text-gray-500 text-[9px] mb-0.5">{card.label}</p>
              <p className={`font-bold text-sm ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Chart placeholder */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 h-16 flex items-end gap-1 overflow-hidden">
          {[30, 55, 40, 70, 45, 80, 60, 75, 50, 90, 65, 85].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${h}%`,
                background: i % 2 === 0
                  ? "rgba(37,99,235,0.5)"
                  : "rgba(74,222,128,0.5)",
              }}
            />
          ))}
        </div>

        {/* Transactions */}
        <div className="space-y-1.5">
          {[
            { icon: "🍔", title: "Food", amount: "-$24", type: "expense" },
            { icon: "💼", title: "Salary", amount: "+$3,200", type: "income" },
            { icon: "🛒", title: "Shopping", amount: "-$89", type: "expense" },
          ].map((t) => (
            <div key={t.title} className="flex justify-between items-center px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <span>{t.icon}</span>
                <span className="text-gray-700 dark:text-gray-300 text-[10px]">{t.title}</span>
              </div>
              <span className={`font-semibold text-[10px] ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                {t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1220] text-gray-900 dark:text-white transition-colors duration-300">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-[#0b1220]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <TrackrAidLogo variant="full" size={32} />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark(!dark)}
              className="cursor-pointer p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <FontAwesomeIcon icon={dark ? faSun : faMoon} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className=" cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className=" cursor-pointer text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 flex flex-col lg:flex-row items-center gap-12">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 tracking-wide uppercase">
            Free • No credit card needed
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5">
            Know exactly{" "}
            <span className="text-blue-600 dark:text-blue-400">where</span>
            <br />your money goes.
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto lg:mx-0">
            TrackerAid helps you log income and expenses, spot spending patterns, and stay in control — without the overwhelm.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <button
              onClick={() => navigate("/signup")}
              className=" cursor-pointer flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-500/20"
            >
              Start for free <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className=" cursor-pointer flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold px-6 py-3 rounded-xl transition"
            >
              Log in
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 justify-center lg:justify-start">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — mockup */}
        <div className="flex-1 w-full max-w-sm mx-auto lg:mx-0">
          <MockDashboard />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
              Everything you need, nothing you don't
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Built for people who want clarity over complexity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <FontAwesomeIcon icon={f.icon} />
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Up and running in minutes
          </h2>
          <p className="text-gray-500 dark:text-gray-400">No setup. No tutorials. Just results.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Create your account", desc: "Sign up free with email or Google. No credit card, no trial period." },
            { step: "02", title: "Log your transactions", desc: "Add income and expenses in seconds. Choose a category, amount, and you're done." },
            { step: "03", title: "See the full picture", desc: "Your dashboard updates instantly. Spot trends, track your balance, stay ahead." },
          ].map((s) => (
            <div key={s.step} className="relative">
              <span className="text-6xl font-extrabold text-gray-100 dark:text-gray-800 select-none absolute -top-4 -left-2">
                {s.step}
              </span>
              <div className="relative pt-6 pl-2">
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-blue-600 dark:bg-blue-700 py-16">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Start tracking today.
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of people who finally know where their money goes.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="cursor-pointer bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition shadow-lg"
          >
            Create free account
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <TrackrAidLogo variant="full" size={28} />
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} TrackerAid. Built with 💙 by Tara.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <button onClick={() => navigate("/login")} className="cursor-pointer hover:text-gray-700 dark:hover:text-white transition">Login</button>
            <button onClick={() => navigate("/signup")} className="cursor-pointer hover:text-gray-700 dark:hover:text-white transition">Sign up</button>
          </div>
        </div>
      </footer>
    </div>
  );
}