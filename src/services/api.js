// API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Token management
const getToken = () => localStorage.getItem("authToken");
const setToken = (token) => localStorage.setItem("authToken", token);
const removeToken = () => localStorage.removeItem("authToken");

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      setToken(response.token);
    }

    return response;
  },

  // Verify token
  verify: async () => {
    try {
      const response = await apiRequest("/auth/verify");
      return response;
    } catch (error) {
      removeToken();
      throw error;
    }
  },

  // Logout
  logout: () => {
    removeToken();
  },

  // Check if user is logged in
  isLoggedIn: () => !!getToken(),

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await authAPI.verify();
      return response.user;
    } catch (error) {
      throw error;
    }
  },
};

export const userAPI = {
  // Get all favorites
  getFavourites: async (userId) => {
    return await apiRequest(`/users/${userId}/favorites`, {
      method: "GET",
    });
  },

  // Toggle a favorite (add/remove based on current state)
  toggleFavourite: async (userId, itemId, itemType) => {
    // Validate that itemId and itemType are provided
    if (!itemId || !itemType) {
      throw new Error("Missing itemId or itemType");
    }

    return await apiRequest(`/users/${userId}/favorites/${itemId}/toggle`, {
      method: "POST",
      body: JSON.stringify({ objectId: itemId, itemId, itemType }),
    });
  },
};

export const ecoOptionsAPI = {
  findDocumentByPropertyToken: async (itemId, itemType) => {
    return await apiRequest(`/search/${itemId}`, {
      method: "POST",
      body: JSON.stringify({ itemType }),
    });
  },
};

// Trips API
export const tripsAPI = {
  // Get all trips with optional filters
  getAllTrips: async (filters = {}) => {
    const queryParams = new URLSearchParams();

    if (filters.tags) queryParams.append("tags", filters.tags);
    if (filters.budgetRange && filters.budgetRange !== "all") {
      queryParams.append("budgetRange", filters.budgetRange);
    }
    if (filters.transportation && filters.transportation !== "all") {
      queryParams.append("transportation", filters.transportation);
    }
    if (filters.search) queryParams.append("search", filters.search);

    const queryString = queryParams.toString();
    const endpoint = `/trips${queryString ? `?${queryString}` : ""}`;

    return await apiRequest(endpoint);
  },

  // Get single trip by ID
  getTripById: async (tripId) => {
    return await apiRequest(`/trips/${tripId}`);
  },

  // Get all available tags
  getAllTags: async () => {
    return await apiRequest("/trips/tags/all");
  },

  // Get all budget ranges
  getBudgetRanges: async () => {
    return await apiRequest("/trips/budget-ranges/all");
  },
};

// Personal Trips API
export const personalTripsAPI = {
  // Get user's personal trips
  getPersonalTrips: async () => {
    return await apiRequest("/personal-trips");
  },

  getPersonalTripById: async (tripId) => {
    return await apiRequest(`/personal-trips/${tripId}`);
  },

  // Add trip to personal collection
  addTripToPersonal: async (tripId) => {
    return await apiRequest(`/personal-trips/${tripId}`, {
      method: "POST",
    });
  },

  // addPlaceToTrip: async (tripId, serpData, placeType) => {
  //   const payload = {
  //     type: placeType,  // or dynamic type if needed
  //     serpData,
  //   };
  //
  //   const res = await axios.post(`/api/personal-trips/${tripId}/add-place`, payload);
  //   return res.data;
  // },

  addPlaceToTrip: async (tripId, serpData, placeType) => {
    const payload = {
      type: placeType,
      serpData: serpData,
    };
    console.log("Payload: ", payload);

    return await apiRequest(`/personal-trips/${tripId}/add-place`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Remove trip from personal collection
  removeTripFromPersonal: async (tripId) => {
    return await apiRequest(`/personal-trips/${tripId}`, {
      method: "DELETE",
    });
  },

  // Add custom activity to personal trip
  addCustomActivity: async (tripId, activityData) => {
    return await apiRequest(`/personal-trips/${tripId}/activities`, {
      method: "POST",
      body: JSON.stringify(activityData),
    });
  },

  // Delete activity from personal trip
  deleteActivity: async (tripId, activityId) => {
    return await apiRequest(
      `/personal-trips/${tripId}/activities/${activityId}`,
      {
        method: "DELETE",
      }
    );
  },
};

// Error handling utility
export const handleApiError = (error, defaultMessage = "An error occurred") => {
  console.error("API Error:", error);

  if (
    error.message.includes("401") ||
    error.message.includes("Invalid token")
  ) {
    // Token expired or invalid
    authAPI.logout();
    window.location.href = "/signin";
    return "Session expired. Please sign in again.";
  }

  return error.message || defaultMessage;
};

// Export token management for other components
export { getToken, setToken, removeToken, apiRequest };
