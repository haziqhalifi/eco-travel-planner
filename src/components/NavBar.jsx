// import { Link } from "react-router-dom";
//
// function Navbar({ isLoggedIn }) {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-white z-50">
//       <div className="container-fluid">
//         <a className="navbar-brand text-success fw-bold" href="/">
//           Eco Travel Planner
//         </a>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav mx-auto">
//             {isLoggedIn && (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link text-black" to="/dashboard">
//                     Dashboard
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link text-black" to="/eco-options">
//                     Eco Options
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link text-black" to="/trip">
//                     Trip
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link text-black" to="/weather">
//                     Weather
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link text-black" to="/footprint">
//                     Carbon Calculator
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//           <ul className="navbar-nav ms-auto">
//             {isLoggedIn ? (
//               <li className="nav-item">
//                 <Link className="nav-link text-black" to="/profile">
//                   Profile
//                 </Link>
//               </li>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link text-black" to="/signin">
//                     Sign In
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link text-black" to="/signup">
//                     Sign Up
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }
//
// export default Navbar;

import { Link } from "react-router-dom";

function Navbar({ isLoggedIn }) {
  return (
      <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="text-dark-green font-bold text-xl">
            Eco Travel Planner
          </a>
          <div className="flex space-x-6">
            {isLoggedIn ? (
                <>
                  <Link className="text-dark-green hover:text-green-600" to="/dashboard">Dashboard</Link>
                  <Link className="text-dark-green hover:text-green-600" to="/eco-options">Eco Options</Link>
                  <Link className="text-dark-green hover:text-green-600" to="/trip">Trip</Link>
                  <Link className="text-dark-green hover:text-green-600" to="/weather">Weather</Link>
                  <Link className="text-dark-green hover:text-green-600" to="/footprint">Carbon Calculator</Link>
                  <Link className="text-dark-green hover:text-green-600" to="/profile">Profile</Link>
                </>
            ) : (
                <>
                  <Link className="text-dark-green hover:text-green-600" to="/signin">Sign In</Link>
                  <Link className="text-dark-green hover:text-green-600" to="/signup">Sign Up</Link>
                </>
            )}
          </div>
        </div>
      </nav>
  );
}

export default Navbar;
