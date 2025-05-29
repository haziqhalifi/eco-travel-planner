import React, { useState, useEffect } from 'react';
import {ecoOptionsAPI, userAPI as userApi} from '../services/api.js';
import { User, Mail, Info, Heart, MapPin, Plane, UtensilsCrossed, Camera, Car, Filter } from 'lucide-react';
import {useAuth} from "../contexts/AuthContext.jsx";
import AccommodationCard from "./ecoOptions/AccommodationCard.jsx";
import {FlightCard} from "./ecoOptions/FlightCard.jsx";
import ActivityCard from "./ecoOptions/ActivityCard.jsx";


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
                      arrayPath: "local_results",
                      matchKey: "place_id",
                    }
                  };

                  const config = typeMap[type];

                  if (
                      searchResultDocument &&
                      searchResultDocument.serpData &&
                      config
                  ) {
                    const dataArray = searchResultDocument.serpData[config.arrayPath];
                    const matchKey = config.matchKey;

                    if (Array.isArray(dataArray)) {
                      const targetProperty = dataArray.find(
                          (property) => property[matchKey] === favoritePropertyToken
                      );

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
        // 3. Save to state
        setFavorites(populatedFavorites);
      } catch (error) {
        console.error("Failed to fetch and populate favorites:", error);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    fetchFavorites();
  }, []);

  const renderFavoriteItem = (item, type) => {
    console.log('renderFavoriteItem item:', item);
    switch (type) {
      case 'accommodations':
        return <AccommodationCard
            userId={userId}
            itemId={item.property_token}
            type={type}
            title={item.name}
            rating={item.overall_rating}
            // location={item.gps_coordinates ? `${item.gps_coordinates.latitude}, ${item.gps_coordinates.longitude}`
            //     : 'Location not available'}
            description={item.description}
            image={Array.isArray(item.images) && item.images.length > 0 ? `https://images.weserv.nl/?url=${encodeURIComponent(item.images[0].thumbnail.replace(/^https?:\/\//, ''))}` : 'https://via.placeholder.com/150'}
            price={item.price}
            serpData={item}
        />
      case 'transportation':
        return <FlightCard key={item._id || item} data={item} />;
      case 'restaurants':
      case 'activities':
        return <ActivityCard
            userId={userId}
            itemId={item.local_results.id}
            type={type}
            name={item.local_results.title}
            location={item.local_results.address}
            rating={item.local_results.rating}
            reviews={item.local_results.reviews}
            priceLevel={item.local_results.price}
            description={item.local_results.description}
            image={item.local_results.thumbnail}
            hours={item.local_results.hours}
            links={item.local_results.links}
            gps={item.local_results.gps}
            serpData={item.local_results}
            // onViewDetails={() =>
            //   handleActivityViewDetails(option)
            // }
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFilter === 'all' ? (
                        Object.entries(favorites).map(([type, items]) =>
                            items.map(item => renderFavoriteItem(item, type))
                        )
                    ) : (
                        (favorites[selectedFilter] || []).map(item =>
                            renderFavoriteItem(item, selectedFilter)
                        )
                    )}
                  </div>
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
