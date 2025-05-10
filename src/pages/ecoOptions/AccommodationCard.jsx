import { useState } from "react";

const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
        stars.push(<span key={`full-${i}`} className="text-yellow-500">★</span>);
    }
    if (hasHalfStar) {
        stars.push(<span key="half" className="text-yellow-500">⯪</span>); // or use a half-star icon from a library
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    return stars;
};

const AccommodationCard = ({ type, title, rating, location, description, image }) => {
    const [isFavorited, setIsFavorited] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
            <div className="relative h-48">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {type}
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg">{title}</h3>
                <div className="flex items-center text-sm text-yellow-500 mb-2">
                    {renderStars(rating)}
                    <span className="text-gray-800">{rating}</span>
                </div>
                <div className="text-gray-600 text-sm mb-2">{location}</div>
                <p className="text-gray-600 text-sm mb-8">{description}</p>

                {/* Heart Icon for Favorites */}
                <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="absolute bottom-3 right-3 text-red-500 text-xl focus:outline-none"
                    aria-label="Add to favorites"
                >
                    {isFavorited ? "❤️" : "🤍"}
                </button>
            </div>
        </div>
    );
};

export default AccommodationCard;
