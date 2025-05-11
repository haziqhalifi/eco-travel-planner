import React, { useState } from "react";
import "../css/weather-icons.min.css";
const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeatherData = async (endpoint, cityName, setData) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/${endpoint}?q=${cityName}&units=metric&appid=${apiKey}`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setData(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  };

  const handleGetWeather = (selectedCity = null) => {
    const cityName = selectedCity || city;

    if (!cityName) {
      setError("Please enter a city name");
      setWeather(null);
      setForecast(null);
      return;
    }

    fetchWeatherData("weather", cityName, setWeather);
    fetchWeatherData("forecast", cityName, setForecast);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  return (
    <div className="bg-light min-vh-100 py-8">
      <div className="container mx-auto my-8">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h1 className="mb-4 text-center">🌤 Weather Forecast</h1>
          <div className="input-group mb-3 w-50 mx-auto">
            <form
              className="d-flex w-100"
              onSubmit={(e) => {
                e.preventDefault();
                handleGetWeather();
              }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-label="City name input"
                autoFocus
              />
              <button
                className="btn btn-primary"
                type="submit"
                aria-label="Get Weather"
              >
                Get Weather
              </button>
            </form>
          </div>

          <div className="mb-4 text-center">
            <h5>Popular Cities:</h5>
            <div className="d-flex justify-content-center gap-2">
              {["New York", "London", "Tokyo", "Paris", "Sydney"].map(
                (city) => (
                  <button
                    key={city}
                    className="btn btn-secondary"
                    onClick={() => handleGetWeather(city)}
                    aria-label={`Get weather for ${city}`}
                  >
                    {city}
                  </button>
                )
              )}
            </div>
          </div>

          {error && <p className="text-danger text-center">{error}</p>}

          {weather && (
            <div
              className="card p-4 mt-3 mx-auto"
              style={{ maxWidth: "800px" }}
            >
              <h3>{weather.name}</h3>
              <p className="text-muted">{getCurrentDateTime()}</p>
              <div className="container text-center">
                <div className="row justify-content-md-center">
                  <div className="col col-md-2 text-center justify-content-center">
                    <i
                      className={`wi wi-${
                        weather.weather[0].main.toLowerCase() === "clear"
                          ? "day-sunny"
                          : weather.weather[0].main.toLowerCase() === "clouds"
                          ? "day-cloudy"
                          : weather.weather[0].main.toLowerCase()
                      }`}
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                  </div>
                  <div className="col col-md-4">
                    <h1>{weather.main.temp}°C</h1>
                    <p>
                      {weather.weather[0].main === "Clear"
                        ? "Sunny"
                        : weather.weather[0].main === "Clouds"
                        ? "Cloudy"
                        : weather.weather[0].main}
                    </p>
                  </div>
                </div>
              </div>
              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Humidity</th>
                    <th>Wind</th>
                    <th>Pressure</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{weather.main.humidity}%</td>
                    <td>{weather.wind.speed} km/h</td>
                    <td>{weather.main.pressure} hPa</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {forecast && (
            <div className="mt-5">
              <h2 className="text-center">5-Day Forecast</h2>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {forecast.list
                  .filter((day) => new Date(day.dt * 1000).getHours() === 14) // Filter for 2 PM
                  .map((day, index) => (
                    <div
                      key={index}
                      className="card p-3 text-center"
                      style={{ width: "150px" }}
                    >
                      <h5>
                        {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </h5>
                      <i
                        className={`wi wi-${
                          day.weather[0].main.toLowerCase() === "clear"
                            ? "day-sunny"
                            : day.weather[0].main.toLowerCase() === "clouds"
                            ? "day-cloudy"
                            : day.weather[0].main.toLowerCase()
                        }`}
                        style={{ fontSize: "2rem" }}
                      ></i>
                      <p>{day.main.temp}°C</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .bg-forest {
          background-color: #1a472a;
        }
      `}</style>
    </div>
  );
};

export default Weather;
