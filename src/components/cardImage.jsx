import { Link } from "react-router-dom";

function CardImage({ title, image, description, linkText, link }) {
  return (
    <div className="card flex-shrink-0" style={{ width: "18rem" }}>
      <div className="card-body">
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%",
            overflow: "hidden",
            borderRadius: "0.5rem",
          }}
        >
          <img
            src={image}
            className="card-img-top"
            alt={title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <h5 className="card-title fw-semibold">{title}</h5>
        <p className="card-text text-secondary">{description}</p>
        <Link to={link} className="text-success fw-medium text-decoration-none">
          {linkText} <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default CardImage;
