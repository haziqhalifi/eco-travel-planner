const AccommodationCard = ({ type, title, rating, location, description, imageSrc }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-48">
            <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {type}
            </div>
        </div>
        <div className="p-4">
            <div className="flex justify-between mb-2">
                <h3 className="font-bold text-lg">{title}</h3>
                <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{rating}</span>
                </div>
            </div>
            <div className="text-gray-600 text-sm mb-2">{location}</div>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    </div>
);

export default AccommodationCard;