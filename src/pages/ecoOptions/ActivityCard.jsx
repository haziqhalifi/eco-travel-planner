import React, {useEffect, useState} from 'react';
import { Star, MapPin, Clock, Phone, Globe, ChevronDown, ChevronUp, Search, Tag, DollarSign } from 'lucide-react';

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
                                         onViewDetails,
                                     }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col" onClick={onViewDetails}>
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
                <div className="flex justify-content-center items-center text-sm text-gray-700 mb-2 space-x-2">
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

// Function to extract common keywords from reviews
const extractKeywords = (reviews) => {
    // Combines all review texts
    const allText = reviews.map(r => r.text).join(' ');

    // List of common words to exclude
    const stopWords = ['the', 'and', 'a', 'an', 'in', 'on', 'at', 'with', 'to', 'for', 'of', 'was', 'were', 'is', 'are'];

    // Split text into words, convert to lowercase, filter out short words and stop words
    const words = allText.toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 3 && !stopWords.includes(word));

    // Count word frequency
    const wordCount = _.countBy(words);

    // Sort by frequency and take top 15
    return Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([word, count]) => ({ word, count }));
};


// const ReviewCard = ({ review, onAddKeywordFilter }) => {
//     return (
//         <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
//             <div className="flex justify-between items-center mb-2">
//                 <div className="flex items-center">
//                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
//                         {review.author.charAt(0)}
//                     </div>
//                     <div className="ml-2">
//                         <p className="font-medium">{review.author}</p>
//                         <div className="flex items-center">
//                             <div className="flex">
//                                 {[...Array(review.rating)].map((_, i) => (
//                                     <Star key={i} size={14} className="text-yellow-500 fill-current" />
//                                 ))}
//                                 {[...Array(5 - review.rating)].map((_, i) => (
//                                     <Star key={i + review.rating} size={14} className="text-gray-300" />
//                                 ))}
//                             </div>
//                             <span className="ml-2 text-xs text-gray-500">{review.date}</span>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="text-sm text-gray-500">
//                     <span>👍 {review.helpful}</span>
//                 </div>
//             </div>
//
//             <p className="text-gray-700 mb-2">{review.text}</p>
//
//             {review.images && (
//                 <div className="flex space-x-2 mb-2">
//                     {review.images.map((img, i) => (
//                         <img
//                             key={i}
//                             src={img}
//                             alt="Review photo"
//                             className="h-20 w-24 object-cover rounded"
//                         />
//                     ))}
//                 </div>
//             )}
//
//             {/* Extract clickable keywords from review */}
//             <div className="flex flex-wrap mt-2">
//                 {review.text.split(" ")
//                     .filter(word => word.length > 4 && !['and', 'the', 'that', 'this', 'with'].includes(word.toLowerCase()))
//                     .filter((v, i, a) => a.indexOf(v) === i)
//                     .slice(0, 3)
//                     .map((word, i) => (
//                         <button
//                             key={i}
//                             onClick={() => onAddKeywordFilter(word.toLowerCase().replace(/[^a-z0-9]/g, ''))}
//                             className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1 mr-1 mb-1"
//                         >
//                             {word.replace(/[^a-zA-Z0-9]/g, '')}
//                         </button>
//                     ))
//                 }
//             </div>
//         </div>
//     );
// };

// Helper component for restaurant rating stars
const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) - fullStars >= 0.5;

    return (
        <div className="flex">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={i} size={18} className="text-yellow-500 fill-current" />
            ))}
            {hasHalfStar && (
                <div className="relative">
                    <Star size={18} className="text-gray-300" />
                    <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                        <Star size={18} className="text-yellow-500 fill-current" />
                    </div>
                </div>
            )}
            {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} size={18} className="text-gray-300" />
            ))}
        </div>
    );
};

// Helper component for price level display
const PriceLevel = ({ price }) => {
    const priceCount = (price || "").length;
    return (
        <div className="flex items-center">
            {[...Array(priceCount)].map((_, i) => (
                <DollarSign key={i} size={16} className="text-gray-700 fill-current" />
            ))}
            {[...Array(4 - priceCount)].map((_, i) => (
                <DollarSign key={i + priceCount} size={16} className="text-gray-300" />
            ))}
        </div>
    );
};

// Review card component
const ReviewCard = ({ review, onAddKeywordFilter }) => {
    return (
        <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                        {review.author?.charAt(0) || '?'}
                    </div>
                    <div className="ml-2">
                        <p className="font-medium">{review.author || 'Anonymous'}</p>
                        <div className="flex items-center">
                            <div className="flex">
                                {[...Array(review.rating || 0)].map((_, i) => (
                                    <Star key={i} size={14} className="text-yellow-500 fill-current" />
                                ))}
                                {[...Array(5 - (review.rating || 0))].map((_, i) => (
                                    <Star key={i + (review.rating || 0)} size={14} className="text-gray-300" />
                                ))}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">{review.date || 'No date'}</span>
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    <span>👍 {review.helpful || 0}</span>
                </div>
            </div>

            <p className="text-gray-700 mb-2">{review.text || 'No review text'}</p>

            {review.images && review.images.length > 0 && (
                <div className="flex space-x-2 mb-2">
                    {review.images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt="Review photo"
                            className="h-20 w-24 object-cover rounded"
                        />
                    ))}
                </div>
            )}

            {/* Extract clickable keywords from review */}
            {review.text && (
                <div className="flex flex-wrap mt-2">
                    {review.text.split(" ")
                        .filter(word => word.length > 4 && !['and', 'the', 'that', 'this', 'with'].includes(word.toLowerCase()))
                        .filter((v, i, a) => a.indexOf(v) === i)
                        .slice(0, 3)
                        .map((word, i) => (
                            <button
                                key={i}
                                onClick={() => onAddKeywordFilter(word.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                                className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1 mr-1 mb-1"
                            >
                                {word.replace(/[^a-zA-Z0-9]/g, '')}
                            </button>
                        ))
                    }
                </div>
            )}
        </div>
    );
};

export function RestaurantDetailView({
                                                 title,
                                                 type,
                                                 rating,
                                                 reviews_count,
                                                 price,
                                                 thumbnail,
                                                 address,
                                                 hours,
                                                 phone,
                                                 website,
                                                 order_link,
                                                 menu_link,
                                                 description,
                                                 extensions,
                                                 service_options,
                                                 gps_coordinates,
                                                 directions_link,
                                                 reviews,
                                                 popular_keywords
                                             }) {
    const [showAllInfo, setShowAllInfo] = useState(false);
    const [keywordFilters, setKeywordFilters] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState(reviews || []);
    const [searchTerm, setSearchTerm] = useState('');

    // Handle adding keyword filter
    const handleAddKeywordFilter = (keyword) => {
        if (!keywordFilters.includes(keyword)) {
            const newFilters = [...keywordFilters, keyword];
            setKeywordFilters(newFilters);

            // Filter reviews based on new filter set
            filterReviews(searchTerm, newFilters);
        }
    };

    // Handle removing keyword filter
    const handleRemoveKeywordFilter = (keyword) => {
        const newFilters = keywordFilters.filter(k => k !== keyword);
        setKeywordFilters(newFilters);

        // Filter reviews based on new filter set
        filterReviews(searchTerm, newFilters);
    };

    // Handle search term change
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        filterReviews(term, keywordFilters);
    };

    // Filter reviews based on search term and keywords
    const filterReviews = (term, filters) => {
        if (!reviews) return;

        let filtered = [...reviews];

        if (term.trim() !== '') {
            filtered = filtered.filter(review =>
                (review.text && review.text.toLowerCase().includes(term.toLowerCase())) ||
                (review.author && review.author.toLowerCase().includes(term.toLowerCase()))
            );
        }

        if (filters.length > 0) {
            filtered = filtered.filter(review =>
                    review.text && filters.some(keyword =>
                        review.text.toLowerCase().includes(keyword.toLowerCase())
                    )
            );
        }

        setFilteredReviews(filtered);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setKeywordFilters([]);
        setFilteredReviews(reviews || []);
    };

    return (
        <div className="max-w-4xl mx-auto bg-gray-50 p-4 md:p-6">
            {/* Restaurant Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <img
                    src={thumbnail || "/api/placeholder/800/400"}
                    alt={title}
                    className="w-full h-64 object-cover"
                />

                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                            <p className="text-gray-600">{type}</p>

                            <div className="flex items-center mt-2">
                                <RatingStars rating={rating} />
                                <span className="ml-2 text-gray-600">({reviews_count})</span>
                            </div>

                            <div className="flex items-center mt-2">
                                {price && <PriceLevel price={price} />}
                                {price && <span className="ml-2 text-gray-600">• {price}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            {order_link && (
                                <a
                                    href={order_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-red-600 text-white rounded-md font-medium text-sm hover:bg-red-700 text-center"
                                >
                                    Order Online
                                </a>
                            )}
                            {menu_link && (
                                <a
                                    href={menu_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium text-sm hover:bg-gray-50 text-center"
                                >
                                    View Menu
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        {address && (
                            <div className="flex items-start space-x-2">
                                <MapPin size={18} className="text-gray-500 mt-1 flex-shrink-0" />
                                <p className="text-gray-700">{address}</p>
                            </div>
                        )}

                        {hours && (
                            <div className="flex items-center mt-2 space-x-2">
                                <Clock size={18} className="text-gray-500 flex-shrink-0" />
                                <p className="text-gray-700">{hours}</p>
                            </div>
                        )}

                        {phone && (
                            <div className="flex items-center mt-2 space-x-2">
                                <Phone size={18} className="text-gray-500 flex-shrink-0" />
                                <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
                                    {phone}
                                </a>
                            </div>
                        )}

                        {website && (
                            <div className="flex items-center mt-2 space-x-2">
                                <Globe size={18} className="text-gray-500 flex-shrink-0" />
                                <a
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Website
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Expandable Info Section */}
                    <div className="mt-4">
                        <button
                            className="flex items-center text-blue-600 hover:underline"
                            onClick={() => setShowAllInfo(!showAllInfo)}
                        >
                            {showAllInfo ? (
                                <>
                                    <ChevronUp size={16} className="mr-1" />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={16} className="mr-1" />
                                    Show More Info
                                </>
                            )}
                        </button>

                        {showAllInfo && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                {description && (
                                    <div className="mb-4">
                                        <h3 className="font-medium text-gray-900 mb-1">About</h3>
                                        <p className="text-gray-700">{description}</p>
                                    </div>
                                )}

                                {extensions && extensions.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="font-medium text-gray-900 mb-1">Features</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {extensions.map((ext, i) => (
                                                <span key={i} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">
                                                    {ext}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {service_options && (
                                    <div className="mb-4">
                                        <h3 className="font-medium text-gray-900 mb-1">Service Options</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {service_options.dine_in && (
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                    Dine-in available
                                                </span>
                                            )}
                                            {service_options.takeout && (
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                    Takeout available
                                                </span>
                                            )}
                                            {service_options.delivery && (
                                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                                    Delivery available
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {gps_coordinates && (
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-1">Location</h3>
                                        <div className="bg-gray-200 p-4 rounded-md text-center">
                                            <p className="text-gray-600 text-sm mb-2">Map Preview</p>
                                            <p className="text-gray-800">
                                                {gps_coordinates.latitude.toFixed(4)}, {gps_coordinates.longitude.toFixed(4)}
                                            </p>
                                            {directions_link && (
                                                <a
                                                    href={directions_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                                                >
                                                    Get Directions
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section - Only show if reviews are available */}
            {reviews && reviews.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Reviews ({filteredReviews.length})</h2>

                    {/* Search and Filter */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search reviews..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                />
                                <div className="absolute left-3 top-3 text-gray-400">🔍</div>
                            </div>

                            {popular_keywords && popular_keywords.length > 0 && (
                                <div className="flex-shrink-0">
                                    <select
                                        className="w-full md:w-auto px-4 py-2 border rounded-lg bg-white"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === "") return;
                                            handleAddKeywordFilter(value);
                                            e.target.value = "";
                                        }}
                                    >
                                        <option value="">Filter by keyword</option>
                                        {popular_keywords.map((keyword, i) => (
                                            <option key={i} value={keyword.word}>
                                                {keyword.word} ({keyword.count})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Active filters */}
                        {keywordFilters.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {keywordFilters.map((keyword, i) => (
                                    <span
                                        key={i}
                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                                    >
                                        <Tag size={12} className="mr-1" />
                                        {keyword}
                                        <button
                                            onClick={() => handleRemoveKeywordFilter(keyword)}
                                            className="ml-1 text-blue-800 hover:text-blue-600"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <button
                                    onClick={clearAllFilters}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Review List */}
                    {filteredReviews.length > 0 ? (
                        <div>
                            {filteredReviews.map((review, index) => (
                                <ReviewCard
                                    key={review.id || index}
                                    review={review}
                                    onAddKeywordFilter={handleAddKeywordFilter}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-500">No reviews match your filters.</p>
                            {keywordFilters.length > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="mt-2 text-blue-600 hover:underline"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Popular Keywords Section */}
            {popular_keywords && popular_keywords.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Popular Mentions</h2>
                    <div className="flex flex-wrap gap-2">
                        {popular_keywords.map((keyword, i) => (
                            <button
                                key={i}
                                onClick={() => handleAddKeywordFilter(keyword.word)}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    keywordFilters.includes(keyword.word)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                            >
                                {keyword.word} ({keyword.count})
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}