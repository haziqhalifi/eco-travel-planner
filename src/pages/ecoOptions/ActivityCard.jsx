import React from 'react';

export default function ActivityCard({
                                         name,
                                         location,
                                         rating,
                                         reviews,
                                         priceLevel,
                                         description,
                                         image,
                                         hours,
                                         links,
                                         gps,
                                     }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            {/* Image */}
            {image && (
                <img
                    src={image}
                    alt={name}
                    className="w-full h-40 object-cover"
                />
            )}

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                {/* Title & Location */}
                <h3 className="text-lg font-semibold mb-1 truncate">{name}</h3>
                {location && <p className="text-sm text-gray-600 mb-2 truncate">{location}</p>}

                {/* Rating, Reviews & Price */}
                <div className="flex items-center text-sm text-gray-700 mb-2 space-x-2">
                    {rating != null && (
                        <span>⭐ {rating}{reviews != null && ` (${reviews})`}</span>
                    )}
                    {priceLevel && <span className="ml-2">• {priceLevel}</span>}
                </div>

                {/* Hours */}
                {hours && (
                    <p className="text-sm text-gray-600 mb-2">
                        🕒 {hours}
                    </p>
                )}

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                        {description}
                    </p>
                )}

                {/* Links and GPS */}
                <div className="mt-auto flex flex-wrap gap-2 text-xs">
                    {links?.website && (
                        <a
                            href={links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-green-100 text-green-800 rounded"
                        >
                            Website
                        </a>
                    )}
                    {links?.directions && (
                        <a
                            href={links.directions}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded"
                        >
                            Directions
                        </a>
                    )}
                    {gps && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
              {gps.latitude.toFixed(2)}, {gps.longitude.toFixed(2)}
            </span>
                    )}
                </div>
            </div>
        </div>
    );
}
