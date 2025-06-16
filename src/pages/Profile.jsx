import React, { useState, useEffect } from 'react';
import {ecoOptionsAPI, userAPI, userAPI as userApi} from '../services/api.js';
import { User, Mail, Info, Heart, MapPin, Plane, UtensilsCrossed, Camera, Car, Filter } from 'lucide-react';
import {useAuth} from "../contexts/AuthContext.jsx";
import AccommodationCard from "./ecoOptions/AccommodationCard.jsx";
import {SingleFlightCard} from "./ecoOptions/SingleFlightCard.jsx";
import ActivityCard from "./ecoOptions/ActivityCard.jsx";
import ReturnFlightCard from "./ecoOptions/ReturnFlightCard.jsx";
import ReturnFlightOption from "./ecoOptions/ReturnFlightOption.jsx";


const ProfilePage = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [bio, setBio] = useState('Edit your Bio.');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempBio, setTempBio] = useState(bio);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [accountDeleted, setAccountDeleted] = useState(false);

  const [returnFlightDetails, setReturnFlightDetails] = useState({});
  const [returnFlightFavorites, setReturnFlightFavorites] = useState({});

  const { user } = useAuth();
  const userId = user?.id;

  const handleSaveProfile = () => {
    setName(tempName);
    setEmail(tempEmail);
    setBio(tempBio);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setTempName(name);
    setTempEmail(email);
    setTempBio(bio);
    setIsEditing(false);
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setIsChangingPassword(false);
  };

  const handleCancelPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action is permanent.');
    if (confirmed) {
      setAccountDeleted(true);
    }
  };

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  const filterTypes = [
    { key: 'all', label: 'All', icon: Heart },
    { key: 'accommodations', label: 'Hotels', icon: MapPin },
    { key: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
    { key: 'activities', label: 'Activities', icon: Camera },
    { key: 'transportation', label: 'Flights', icon: Plane }
  ];

  const [favorites, setFavorites] = useState({
    accommodations: [],
    restaurants: [],
    activities: [],
    transportation: []
  });

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setIsLoadingFavorites(true);

        // 1. Fetch IDs from backend
        const favoritesRes = await userApi.getFavourites(userId);
        const rawFavorites = favoritesRes.data; // { accommodations: [...], etc. }

        console.log("rawFavorites", rawFavorites)
        const populatedFavorites = {};
        const transportationFavoritesMap = {};

        // 2. For each type, fetch full data using itemId
        // for (const [type, ids] of Object.entries(rawFavorites)) {
        //   const populatedItems = await Promise.all(
        //       ids.map(async (id) => {
        //         const response = await ecoOptionsAPI.findDocumentByPropertyToken(id, type);
        //         return response.data; // Adjust if your API returns differently
        //       })
        //   );
        //   populatedFavorites[type] = populatedItems;
        // }

        for (const [type, ids] of Object.entries(rawFavorites)) {
          if (!Array.isArray(ids) || ids.length === 0) {
            populatedFavorites[type] = []; // Handle empty or invalid IDs list
            continue;
          }

          const populatedItemsForType = await Promise.all(
              ids.map(async (favoritePropertyToken) => { // Renamed 'id' for clarity
                try {
                  // This API call fetches the whole search document that *contains* properties
                  const response = await ecoOptionsAPI.findDocumentByPropertyToken(favoritePropertyToken, type);
                  const searchResultDocument = response.data;
                  if (type === "transportation")
                    console.log("searchResultDocument", response.data)

                  const typeMap = {
                    accommodations: {
                      arrayPath: "properties",
                      matchKey: "property_token",
                    },
                    restaurants: {
                      arrayPath: "local_results",
                      matchKey: "place_id",
                    },
                    activities: {
                      arrayPath: "local_results",
                      matchKey: "place_id",
                    },
                    transportation: {
                      arrayPath: ["best_flights", "other_flights"],
                      matchKey: "booking_token",
                    }
                  };

                  const config = typeMap[type];

                  if (
                      searchResultDocument &&
                      searchResultDocument.serpData &&
                      config
                  ) {
                    // const dataArray = searchResultDocument.serpData[config.arrayPath];
                    let dataArray = [];

                    if (Array.isArray(config.arrayPath)) {
                      for (const path of config.arrayPath) {
                        const arrayPart = searchResultDocument.serpData[path];
                        if (Array.isArray(arrayPart)) {
                          dataArray = dataArray.concat(arrayPart);
                        }
                      }
                    } else {
                      const singleArray = searchResultDocument.serpData[config.arrayPath];
                      if (Array.isArray(singleArray)) {
                        dataArray = singleArray;
                      }
                    }

                    const matchKey = config.matchKey;

                    if (Array.isArray(dataArray)) {
                      let targetProperty = null;

                      if (type === "transportation") {
                        for (const item of dataArray) {
                          if (Array.isArray(item.return_flights)) {
                            const match = item.return_flights.find(
                                (flight) => flight[matchKey] === favoritePropertyToken
                            );
                            if (match) {
                              targetProperty = match; // Return the individual flight, not the parent item
                              // Mark this booking token as favorited
                              transportationFavoritesMap[favoritePropertyToken] = true;
                              break;
                            }
                          }
                        }
                      } else {
                        targetProperty = dataArray.find(
                            (property) => property[matchKey] === favoritePropertyToken
                        );
                      }

                      if (targetProperty) {
                        return targetProperty;
                      } else {
                        console.warn(
                            `Item with ${matchKey} ${favoritePropertyToken} not found in ${config.arrayPath} for type ${type}.`
                        );
                        return null;
                      }
                    } else {
                      console.warn(
                          `Expected an array at ${config.arrayPath} in serpData for type ${type}.`
                      );
                      return null;
                    }
                  } else {
                    console.warn(`Missing serpData or invalid type config for type ${type}.`);
                    return null;
                  }
                } catch (error) {
                  console.error(`Failed to fetch or process item with token ${favoritePropertyToken} for type ${type}:`, error);
                  return null; // Or re-throw, or handle error appropriately
                }
              })
          );

          // Filter out any nulls that might have resulted from errors or not finding items
          populatedFavorites[type] = populatedItemsForType.filter(item => item !== null);
        }

        console.log("Populated Favorites:", populatedFavorites);
        console.log("Transportation Favorites Map:", transportationFavoritesMap);

        // 3. Save to state
        setFavorites(populatedFavorites);
        setReturnFlightFavorites(transportationFavoritesMap);
      } catch (error) {
        console.error("Failed to fetch and populate favorites:", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, []);


  const handleReturnFlightViewDetails = (returnFlightIndex) => {
    setReturnFlightDetails(prev => ({
      ...prev,
      [returnFlightIndex]: !prev[returnFlightIndex]
    }));
  };

  const handleReturnFlightToggleFavorite = async (returnFlight, returnFlightIndex) => {
    try {
      await userAPI.toggleFavourite(userId, returnFlight.bookingToken, 'transportation');
      setReturnFlightFavorites(prev => ({
        ...prev,
        [returnFlight.bookingToken]: !prev[returnFlight.bookingToken]
      }));

      // If unfavoriting, also remove from favorites list
      if (returnFlightFavorites[returnFlight.bookingToken]) {
        setFavorites(prev => ({
          ...prev,
          transportation: prev.transportation.filter(item => item.bookingToken !== returnFlight.bookingToken)
        }));
      }
    } catch (err) {
      console.error("Failed to toggle return flight favourite", err);
    }
  };

  const TransportationReturnFlight = ({ bookingToken, userId }) => {
    const [returnFlight, setReturnFlight] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [returnFlightDetails, setReturnFlightDetails] = useState({});
    const [returnFlightFavorites, setReturnFlightFavorites] = useState({});

    useEffect(() => {
      const fetchReturnFlightFromProfile = async () => {
        if (!bookingToken || !userId) {
          setError('Missing booking token or user ID');
          setLoading(false);
          return;
        }

        try {
          setLoading(true);

          // Fetch user's transportation favorites to get the return flight
          const favouritesRes = await userAPI.getFavourites(userId);
          const transportationFavourites = favouritesRes.data.transportation || [];

          // Get user profile or search history to find the flight data
          const userProfile = await userAPI.getUserProfile();

          let foundReturnFlight = null;

          // Search in user's saved/recent flights
          if (userProfile.recentFlights) {
            foundReturnFlight = userProfile.recentFlights.find(
                flight => flight.bookingToken === bookingToken && flight.type === 'return'
            );
          }

          // Search in transportation items
          if (!foundReturnFlight && userProfile.transportationItems) {
            foundReturnFlight = userProfile.transportationItems.find(
                item => item.bookingToken === bookingToken
            );
          }

          // Search in flight history
          if (!foundReturnFlight && userProfile.flightHistory) {
            for (const flightGroup of userProfile.flightHistory) {
              if (flightGroup.returnFlights) {
                foundReturnFlight = flightGroup.returnFlights.find(
                    flight => flight.bookingToken === bookingToken
                );
                if (foundReturnFlight) break;
              }
            }
          }

          if (foundReturnFlight) {
            setReturnFlight(foundReturnFlight);

            // Set favorite status
            const favoritesMap = {};
            if (transportationFavourites.includes(bookingToken)) {
              favoritesMap[bookingToken] = true;
            }
            setReturnFlightFavorites(favoritesMap);
          } else {
            setError('Return flight not found with the provided booking token');
          }

        } catch (err) {
          console.error('Error fetching return flight from profile:', err);
          setError('Failed to fetch return flight data');
        } finally {
          setLoading(false);
        }
      };

      fetchReturnFlightFromProfile();
    }, [bookingToken, userId]);

    const handleViewDetails = (index) => {
      setReturnFlightDetails(prev => ({
        ...prev,
        [index]: !prev[index]
      }));
    };

    const handleToggleFavorite = async (flight, index) => {
      try {
        await userAPI.toggleFavourite(userId, flight.bookingToken, 'transportation');
        setReturnFlightFavorites(prev => ({
          ...prev,
          [flight.bookingToken]: !prev[flight.bookingToken]
        }));
      } catch (err) {
        console.error("Failed to toggle return flight favourite", err);
      }
    };

    if (loading) {
      return (
          <div className="bg-white rounded-xl p-4 mb-3 border border-gray-200 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
      );
    }

    if (error) {
      return (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
      );
    }

    if (!returnFlight) {
      return (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
            <p className="text-gray-600 text-sm">No return flight data available</p>
          </div>
      );
    }

    return (
        <ReturnFlightOption
            returnFlight={returnFlight}
            index={0}
            returnFlightDetails={returnFlightDetails}
            returnFlightFavorites={returnFlightFavorites}
            onViewDetails={handleViewDetails}
            onToggleFavorite={handleToggleFavorite}
        />
    );
  };

  const renderFavoriteItem = (item, type, index) => {
    switch (type) {
      case 'accommodations':
        return <AccommodationCard
            userId={userId}
            itemId={item.property_token}
            type={type}
            title={item.name}
            rating={item.overall_rating}
            description={item.description}
            image={Array.isArray(item.images) && item.images.length > 0 ? `https://images.weserv.nl/?url=${encodeURIComponent(item.images[0].thumbnail.replace(/^https?:\/\//, ''))}` : 'https://via.placeholder.com/150'}
            price={item.price}
            serpData={item}
        />
      case 'transportation':
        // For transportation, item should be the individual return flight
          console.log("item", item)
        return <ReturnFlightOption
            returnFlight={item}
            userId={userId}
            bookingToken={item.booking_token}
            flights={item.flights}
            layovers={item.layovers}
            total_duration={item.total_duration}
            carbon_emission={item.carbon_emission}
            price={item.price}
            type={item.type}
            airline_logo={item.airline_logo}
        />
      case 'restaurants':
      case 'activities':
        return <ActivityCard
            userId={userId}
            itemId={item.place_id}
            type={type}
            name={item.title}
            location={item.address}
            rating={item.rating}
            reviews={item.reviews}
            priceLevel={item.price}
            description={item.description}
            image={item.thumbnail}
            hours={item.hours}
            links={item.links}
            gps={item.gps}
            serpData={item}
        />
      default:
        return null;
    }
  };

  const getFilteredFavorites = () => {
    if (selectedFilter === 'all') {
      const allFavorites = [];
      Object.entries(favorites).forEach(([type, items]) => {
        items.forEach(item => {
          allFavorites.push({ ...item, type });
        });
      });
      return allFavorites;
    }
    return favorites[selectedFilter] || [];
  };

  const getTotalFavoritesCount = () => {
    return Object.values(favorites).reduce((total, items) => total + items.length, 0);
  };

  return (
      <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-yellow-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

          {accountDeleted ? (
              <div className="text-center text-red-600 text-xl mt-20">
                Your account has been deleted.
              </div>
          ) : (
              <>
                {/* Account Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Account Information</h2>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                        >
                          Edit Profile
                        </button>
                    )}
                  </div>

                  {!isEditing ? (
                      <div className="space-y-6">
                        <div className="flex items-start gap-x-4">
                          <User className="text-gray-500 mt-1" />
                          <div className="text-left">
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{name}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-x-4">
                          <Mail className="text-gray-500 mt-1" />
                          <div className="text-left">
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{email}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-x-4">
                          <Info className="text-gray-500 mt-1" />
                          <div className="text-left">
                            <p className="text-sm text-gray-500">Bio</p>
                            <p className="font-medium">{bio}</p>
                          </div>
                        </div>
                      </div>
                  ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <input
                              type="text"
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              className="block w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                              type="email"
                              value={tempEmail}
                              onChange={(e) => setTempEmail(e.target.value)}
                              className="block w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                          <textarea
                              value={tempBio}
                              onChange={(e) => setTempBio(e.target.value)}
                              className="block w-full px-3 py-2 border rounded-md"
                              rows={4}
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                              onClick={handleCancelEdit}
                              className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                              onClick={handleSaveProfile}
                              className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-100"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                  )}
                </div>

                {/* Password Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Password</h2>
                    {!isChangingPassword && (
                        <button
                            onClick={() => setIsChangingPassword(true)}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                        >
                          Change Password
                        </button>
                    )}
                  </div>

                  {isChangingPassword && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                          <input
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="block w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="block w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                          <input
                              type="password"
                              value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              className="block w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                              onClick={handleCancelPassword}
                              className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                              onClick={handleSavePassword}
                              className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-100"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                  )}
                </div>

                {/* Delete Account Button */}
                <div className="text-right">
                  <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                  >
                    Delete Account
                  </button>
                </div>

                {/* Favorites Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Heart className="text-red-500" />
                      <h2 className="text-xl font-semibold text-gray-800">My Favorites</h2>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {getTotalFavoritesCount()}
                  </span>
                    </div>
                    <button
                        // onClick={getAllFavourites}
                        disabled={isLoadingFavorites}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50"
                    >
                      {isLoadingFavorites ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {filterTypes.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setSelectedFilter(key)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                selectedFilter === key
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                          <Icon size={16} />
                          {label}
                          {key !== 'all' && (
                              <span className="bg-white px-1.5 py-0.5 rounded text-xs">
                        {favorites[key]?.length || 0}
                      </span>
                          )}
                        </button>
                    ))}
                  </div>

                  {/* Favorites Grid */}
                  {isLoadingFavorites ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      </div>
                  ) : (
                      <>
                        {/* Non-Transportation Items Grid */}
                        <div
                            className={`grid gap-4 ${
                                selectedFilter === 'transportation'
                                    ? 'grid-cols-1'
                                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            }`}
                        >
                          {selectedFilter === 'all' ? (
                              <>
                                {/* Render all non-transportation items first */}
                                {Object.entries(favorites)
                                    .filter(([type]) => type !== 'transportation')
                                    .flatMap(([type, items]) =>
                                        items.map((item, index) =>
                                            renderFavoriteItem(item, type, `${type}-${index}`)
                                        )
                                    )}
                              </>
                          ) : (
                              (favorites[selectedFilter] || []).map((item, index) =>
                                  renderFavoriteItem(item, selectedFilter, `${selectedFilter}-${index}`)
                              )
                          )}
                        </div>

                        {/* Transportation Section (only when viewing "all") */}
                        {selectedFilter === 'all' && favorites.transportation?.length > 0 && (
                            <div className="mt-8">
                              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                Transportation
                              </h3>
                              <div className="grid grid-cols-1 gap-4">
                                {favorites.transportation.map((item, index) =>
                                    renderFavoriteItem(item, 'transportation', `transportation-${index}`)
                                )}
                              </div>
                            </div>
                        )}
                      </>
                  )}



                  {!isLoadingFavorites && getFilteredFavorites().length === 0 && (
                      <div className="text-center py-12">
                        <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500">
                          {selectedFilter === 'all'
                              ? 'No favorites yet. Start exploring to add some!'
                              : `No ${selectedFilter} in your favorites yet.`
                          }
                        </p>
                      </div>
                  )}
                </div>

              </>
          )}
        </div>
      </div>
  );
};

export default ProfilePage;