import React from "react";
import { Link } from "react-router-dom";

function CardImage({ title, image, description, linkText }) {
  return (
    <div className="card flex-shrink-0" style={{ width: "18rem" }}>
      <div className="card-body">
        <img src={image} className="card-img-top" alt={title} />
        <h5 className="card-title fw-semibold">{title}</h5>
        <p className="card-text text-secondary">{description}</p>
        <Link to="/" className="text-success fw-medium text-decoration-none">
          {linkText} <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default CardImage;
