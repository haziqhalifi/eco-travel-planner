import { Link } from "react-router-dom";

function Navbar({ isLoggedIn }) {
  return (
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
              <li className="nav-item">
                <Link className="nav-link text-black" to="/profile">
                  Profile
                </Link>
              </li>
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
  );
}

export default Navbar;
