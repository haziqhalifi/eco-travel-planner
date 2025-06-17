import React, { useState, useEffect } from 'react';
import { ecoOptionsAPI, userAPI } from '../services/api.js';
import { User, Mail, Info, Heart, MapPin, Plane, UtensilsCrossed, Camera, Car, Filter } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext.jsx";
import AccommodationCard from "./ecoOptions/AccommodationCard.jsx";
import { SingleFlightCard } from "./ecoOptions/SingleFlightCard.jsx";
import ActivityCard from "./ecoOptions/ActivityCard.jsx";
import ReturnFlightCard from "./ecoOptions/ReturnFlightCard.jsx";
import ReturnFlightOption from "./ecoOptions/ReturnFlightOption.jsx";

const ProfilePage = () => {
  const [name, setName] = useState('Loading...');
  const [email, setEmail] = useState('Loading...');
  const [bio, setBio] = useState('Edit your Bio.');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [tempBio, setTempBio] = useState('');

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [accountDeleted, setAccountDeleted] = useState(false);

  const [returnFlightDetails, setReturnFlightDetails] = useState({});
  const [returnFlightFavorites, setReturnFlightFavorites] = useState({});

  const { user } = useAuth();
  const userId = user?.id;

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

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No token found, please login.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();

        setName(data.user.username);
        setEmail(data.user.email);
        setBio(data.user.bio || 'Edit your Bio.');

        setTempName(data.user.username);
        setTempEmail(data.user.email);
        setTempBio(data.user.bio || 'Edit your Bio.');
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to load user data.');
      }
    };

    fetchUserData();
  }, [user]); // Added user as dependency

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      
      try {
        setIsLoadingFavorites(true);

        // 1. Fetch IDs from backend
        const favoritesRes = await userAPI.getFavourites(userId);
        const rawFavorites = favoritesRes.data;

        console.log("rawFavorites", rawFavorites);
        const populatedFavorites = {};
        const transportationFavoritesMap = {};

        for (const [type, ids] of Object.entries(rawFavorites)) {
          if (!Array.isArray(ids) || ids.length === 0) {
            populatedFavorites[type] = [];
            continue;
          }

          const populatedItemsForType = await Promise.all(
            ids.map(async (favoritePropertyToken) => {
              try {
                const response = await ecoOptionsAPI.findDocumentByPropertyToken(favoritePropertyToken, type);
                const searchResultDocument = response.data;

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

                if (searchResultDocument?.serpData && config) {
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
                            targetProperty = match;
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
                return null;
              }
            })
          );

          populatedFavorites[type] = populatedItemsForType.filter(item => item !== null);
        }

        setFavorites(populatedFavorites);
        setReturnFlightFavorites(transportationFavoritesMap);
      } catch (error) {
        console.error("Failed to fetch and populate favorites:", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const handleSaveProfile = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('No token found. Please login again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: tempName,
          email: tempEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();

      setName(data.user.username);
      setEmail(data.user.email);
      setBio(tempBio);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setTempName(name);
    setTempEmail(email);
    setTempBio(bio);
    setIsEditing(false);
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('No token found. Please login again.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/auth/update-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }

      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Error updating password:', error);
      alert(error.message || 'Failed to update password. Please try again.');
    }
  };

  const handleCancelPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action is permanent.'
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('No token found. Please login again.');
        return;
      }

      const response = await fetch('http://localhost:5001/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      setAccountDeleted(true);
      localStorage.removeItem('authToken');
      // You might want to redirect here
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const handleReturnFlightViewDetails = (returnFlightIndex) => {
    setReturnFlightDetails(prev => ({
      ...prev,
      [returnFlightIndex]: !prev[returnFlightIndex]
    }));
  };

  const handleReturnFlightToggleFavorite = async (returnFlight) => {
    try {
      const bookingToken = returnFlight.booking_token || returnFlight.bookingToken;
      await userAPI.toggleFavourite(userId, bookingToken, 'transportation');
      setReturnFlightFavorites(prev => ({
        ...prev,
        [bookingToken]: !prev[bookingToken]
      }));

      if (returnFlightFavorites[bookingToken]) {
        setFavorites(prev => ({
          ...prev,
          transportation: prev.transportation.filter(item => 
            (item.booking_token || item.bookingToken) !== bookingToken
          )
        }));
      }
    } catch (err) {
      console.error("Failed to toggle return flight favourite", err);
    }
  };

  const renderFavoriteItem = (item, type, index) => {
    switch (type) {
      case 'accommodations':
        return (
          <AccommodationCard
            key={`${type}-${index}`}
            userId={userId}
            itemId={item.property_token}
            type={type}
            title={item.name}
            rating={item.overall_rating}
            description={item.description}
            image={Array.isArray(item.images) && item.images.length > 0 ? 
              `https://images.weserv.nl/?url=${encodeURIComponent(item.images[0].thumbnail.replace(/^https?:\/\//, ''))}` : 
              'https://via.placeholder.com/150'}
            price={item.price}
            serpData={item}
          />
        );
      case 'transportation':
        const bookingToken = item.booking_token || item.bookingToken;
        return (
          <ReturnFlightOption
            key={`${type}-${index}`}
            returnFlight={item}
            userId={userId}
            bookingToken={bookingToken}
            flights={item.flights}
            layovers={item.layovers}
            total_duration={item.total_duration}
            carbon_emission={item.carbon_emission}
            price={item.price}
            type={item.type}
            airline_logo={item.airline_logo}
            isFavorite={returnFlightFavorites[bookingToken]}
            onToggleFavorite={() => handleReturnFlightToggleFavorite(item)}
          />
        );
      case 'restaurants':
      case 'activities':
        return (
          <ActivityCard
            key={`${type}-${index}`}
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
        );
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
            <div className="text-right mb-8">
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
                  disabled={isLoadingFavorites}
                  onClick={() => window.location.reload()} // Simple refresh
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
                  <div
                    className={`grid gap-4 ${
                      selectedFilter === 'transportation'
                        ? 'grid-cols-1'
                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}
                  >
                    {getFilteredFavorites().map((item, index) =>
                      renderFavoriteItem(item, selectedFilter === 'all' ? item.type : selectedFilter, index)
                    )}
                  </div>

                  {selectedFilter === 'all' && favorites.transportation?.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Transportation
                      </h3>
                      <div className="grid grid-cols-1 gap-4">
                        {favorites.transportation.map((item, index) =>
                          renderFavoriteItem(item, 'transportation', index)
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