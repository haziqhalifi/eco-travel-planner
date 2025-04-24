import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { useState } from "react";
import "./App.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import EcoOptions from "./pages/EcoOptions";
import Itinerary from "./pages/Itinerary";
import Weather from "./pages/Weather";
import CarbonCalculator from "./pages/CarbonCalculator";
import Profile from "./pages/Profile";
import Trip from "./pages/Trip.jsx";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-light d-flex flex-column">
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
          <div className="container-fluid">
            <a className="navbar-brand text-success fw-bold" href="/">
              Eco Travel Planner
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mx-auto">
                {isLoggedIn && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-black" to="/dashboard">
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-black" to="/eco-options">
                        Eco Options
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-black" to="/trip">
                        Trip
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-black" to="/weather">
                        Weather
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-black" to="/footprint">
                        Carbon Calculator
                      </Link>
                    </li>
                  </>
                )}
              </ul>
              <ul className="navbar-nav ms-auto">
                {isLoggedIn ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-black" to="/profile">
                        Profile
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-black" to="/signin">
                        Sign In
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-black" to="/signup">
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        <div className="container py-4 flex-grow-1">
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
        </div>
      </div>
    </Router>
  );
}

export default App;
