import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

function Navbar({ isLoggedIn }) {
  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <a
          href="/"
          className="flex items-center text-dark-green font-bold text-xl"
        >
          <img
            src={Logo}
            alt="Eco Travel Planner Logo"
            style={{ width: "30px", height: "30px", marginRight: "10px" }}
            className="rounded-md"
          />
          <span>Eco Travel Planner</span>
        </a>
        <div className="flex space-x-6">
          {isLoggedIn ? (
            <>
              <Link
                className="text-dark-green hover:text-green-600"
                to="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="text-dark-green hover:text-green-600"
                to="/eco-options"
              >
                Travel Options
              </Link>
              <Link className="text-dark-green hover:text-green-600" to="/trip">
                Travel Plan
              </Link>
              <Link
                className="text-dark-green hover:text-green-600"
                to="/weather"
              >
                Weather
              </Link>
              <Link
                className="text-dark-green hover:text-green-600"
                to="/carbon-calculator"
              >
                Carbon Calculator
              </Link>
              <Link
                className="text-dark-green hover:text-green-600"
                to="/profile"
              >
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                className="text-dark-green hover:text-green-600"
                to="/signin"
              >
                Sign In
              </Link>
              <Link
                className="text-dark-green hover:text-green-600"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
