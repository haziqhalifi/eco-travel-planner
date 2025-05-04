import React from "react";
import { Link } from "react-router-dom";

function Card({ title, description, icon, linkText }) {
  return (
    <div
      className="card d-flex flex-column h-100"
      style={{ width: "18rem", minHeight: "250px" }} // fixed size
    >
      <div className="card-body d-flex flex-column">
        <div className="mb-3">{icon}</div>
        <h5 className="card-title fw-semibold">{title}</h5>
        <p className="card-text text-secondary flex-grow-1">{description}</p>
        <Link
          to="/"
          className="text-success fw-medium text-decoration-none mt-auto"
        >
          {linkText} <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default Card;
