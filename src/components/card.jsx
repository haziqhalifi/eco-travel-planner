import { Link } from "react-router-dom";

function Card({ title, description, icon, linkText, link }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body text-center">
        <div className="mb-3 d-flex justify-content-center">{icon}</div>
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        {link && (
          <Link to={link} className="btn btn-success mt-2">
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
}

export default Card;
