import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import Footer from "./components/footer.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isLoggedIn ? children : <Navigate to="/signin" />;
};

// Main App Component
const AppContent = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/signin"} />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/eco-options"
            element={
              <ProtectedRoute>
                <EcoOptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip"
            element={
              <ProtectedRoute>
                <Trip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/itinerary/:tripId"
            element={
              <ProtectedRoute>
                <Itinerary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weather"
            element={
              <ProtectedRoute>
                <Weather />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carbon-calculator"
            element={
              <ProtectedRoute>
                <CarbonCalculator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
