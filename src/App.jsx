import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import NavBar from "./Component/NavBar";
import Dashboard from "./Pages/Dashboard";
import TransactionPage from "./Pages/TransactionPage";
import Settings from "./Pages/Settings";
import AddTransaction from "./Pages/AddTransaction";
import FullTransaction from "./Pages/FullTransaction";
import ChartBox from "./Component/ChartBox";
import LoginPage from "./Oauth/LoginPage";
import SignUpPage from "./Oauth/SigninPage";
import Onboarding from "./OnboardingFlow/onBoarding";

function App() {
  const location = useLocation();
  const hideNavBar =
    location.pathname === "/add-transaction" ||
    location.pathname === "/login-page" ||
    location.pathname === "/onboarding" ||
    location.pathname === "/" ||
    location.pathname === "/signup";

  const needsOnboarding = localStorage.getItem("needsOnboarding") === "true";

  return (
    <div className="h-screen w-full overflow-hidden bg-white dark:bg-[#0b1220] relative">
      {!hideNavBar && (
        <>
          <NavBar />
          <ChartBox />
        </>
      )}

      <main
        className={
          !hideNavBar
            ? "h-screen overflow-y-auto mx-auto"
            : "h-screen overflow-y-auto"
        }
      >
        <Routes>
          <Route path="/" element={<LoginPage />} />

          
          <Route
            path="/onboarding"
            element={
              needsOnboarding ? <Onboarding /> : <Navigate to="/dashboard" replace />
            }
          />

          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/full-transaction/:id" element={<FullTransaction />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;