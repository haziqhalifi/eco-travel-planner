// Weather API for saved cities
import { apiRequest } from "./api";

export const weatherAPI = {
  // Save a city for the user
  saveCity: async (city) => {
    return await apiRequest("/weather/save", {
      method: "POST",
      body: JSON.stringify({ city }),
    });
  },

  // Get all saved cities for the user
  getSavedCities: async () => {
    return await apiRequest("/weather/saved");
  },

  // Remove a city from the user's saved list
  removeCity: async (city) => {
    return await apiRequest("/weather/remove", {
      method: "POST",
      body: JSON.stringify({ city }),
    });
  },
};
