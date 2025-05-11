import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import "./App.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import EcoOptions from "./pages/ecoOptions/EcoOptions.jsx";
import Itinerary from "./pages/Itinerary";
import Weather from "./pages/Weather";
import CarbonCalculator from "./pages/CarbonCalculator";
import Profile from "./pages/Profile";
import Trip from "./pages/Trip.jsx";
import Navbar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column bg-light">
        <Navbar isLoggedIn={isLoggedIn} />

        <main className="flex-grow-1">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={isLoggedIn ? "/dashboard" : "/signin"} />}
            />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/signin"
              element={<SignIn setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" />}
            />
            <Route path="/eco-options" element={<EcoOptions />} />
            <Route path="/trip" element={<Trip />} />
            <Route path="/itinerary/:tripId" element={<Itinerary />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/footprint" element={<CarbonCalculator />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
