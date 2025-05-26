import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import "../css/weather-icons.min.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [savedCities, setSavedCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeatherData = async (endpoint, cityName, setData) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      if (!weatherRes.ok || !forecastRes.ok)
        throw new Error("Location not found");

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();

      setWeather(weatherData);
      setForecast(forecastData);
      setCity(weatherData.name);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        setError("Unable to retrieve your location.");
      }
    );
  };

  const handleGetWeather = (selectedCity = null) => {
    const cityName = selectedCity || city;

    if (!cityName) {
      setError("Please enter a city name");
      setWeather(null);
      setForecast(null);
      return;
    }

    setCity(cityName);
    fetchWeatherData("weather", cityName, setWeather);
    fetchWeatherData("forecast", cityName, setForecast);
  };

  const handleSaveCity = () => {
    if (weather && weather.name && !savedCities.includes(weather.name)) {
      setSavedCities([...savedCities, weather.name]);
    }
  };

  const handleRemoveCity = (cityToRemove) => {
    setSavedCities(savedCities.filter((c) => c !== cityToRemove));
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  const formatUnixTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString();
  };

  const getHourlyChartData = () => {
    return forecast?.list.slice(0, 12).map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: item.main.temp,
    }));
  };

  const getWeatherIcon = (weatherMain) => {
    const iconMap = {
      clear: "day-sunny",
      clouds: "day-cloudy",
      rain: "day-rain",
      snow: "day-snow",
      thunderstorm: "day-thunderstorm",
      drizzle: "day-sprinkle",
      mist: "day-fog",
      fog: "day-fog",
    };
    return iconMap[weatherMain.toLowerCase()] || "day-sunny";
  };

  return (
    <motion.div
      className="min-vh-100 py-4"
      style={{
        background: "linear-gradient(135deg, #e0f7fa 0%, #fffde4 100%)",
        backgroundAttachment: "fixed",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="container mx-auto px-3">
        <motion.div
          className="bg-white rounded-3 shadow-lg p-4 p-md-5"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
          }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-5"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="display-4 fw-bold mb-2">
              <i className="wi wi-day-sunny me-3"></i>
              Weather Forecast
            </h1>
            <p className="text-muted fs-5">
              Get real-time weather information for any city
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            className="row justify-content-center mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="col-lg-6 col-md-8">
              <form
                className="d-flex gap-2 mb-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleGetWeather();
                }}
              >
                <div className="flex-grow-1 position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-pill ps-4 pe-5 shadow-sm"
                    placeholder="Enter city name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    autoFocus
                    disabled={loading}
                    style={{
                      border: "2px solid #4caf50",
                      fontSize: "1.1rem",
                      transition: "all 0.3s ease",
                    }}
                  />
                  {loading && (
                    <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-success btn-lg rounded-pill px-4 shadow-sm d-flex align-items-center gap-2"
                  type="submit"
                  disabled={loading}
                  style={{ minWidth: "120px" }}
                >
                  <i className="wi wi-refresh"></i>
                  Search
                </button>
              </form>

              {weather && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    className="btn btn-outline-success rounded-pill px-4 shadow-sm d-flex align-items-center gap-2 mx-auto"
                    onClick={handleSaveCity}
                    disabled={!weather || savedCities.includes(weather.name)}
                  >
                    <i className="wi wi-star"></i>
                    {savedCities.includes(weather.name)
                      ? "City Saved"
                      : "Save City"}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Quick Access Cities */}
          <motion.div
            className="mb-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h5 className="text-muted mb-3 fw-semibold">Quick Access</h5>
            <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
              <motion.button
                className="btn  rounded-pill shadow-sm d-flex align-items-center gap-2 px-3 py-2"
                onClick={handleGetLocationWeather}
                disabled={loading}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  background: "linear-gradient(45deg, #007bff, #0056b3)",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)",
                }}
              >
                <i className="wi wi-direction-up"></i>
                My Location
              </motion.button>
              {["New York", "London", "Tokyo", "Paris", "Sydney"].map(
                (cityName) => (
                  <motion.button
                    key={cityName}
                    className="btn btn-outline-secondary rounded-pill shadow-sm d-flex align-items-center gap-2 px-3 py-2"
                    onClick={() => handleGetWeather(cityName)}
                    disabled={loading}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      borderColor: "#6c757d",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <i className="wi wi-day-cloudy-gusts"></i>
                    {cityName}
                  </motion.button>
                )
              )}
            </div>

            {/* Saved Cities */}
            {savedCities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
              >
                <h6 className="text-muted mb-3 fw-semibold">
                  <i className="wi wi-stars me-2"></i>Saved Cities
                </h6>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  {savedCities.map((savedCity, idx) => (
                    <motion.div
                      key={savedCity}
                      className="position-relative"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      style={{ display: "inline-block" }}
                    >
                      <button
                        className="btn btn-outline-warning rounded-pill shadow-sm d-flex align-items-center gap-2 px-3 py-2 pe-5"
                        onClick={() => handleGetWeather(savedCity)}
                        disabled={loading}
                        style={{
                          borderColor: "#ffc107",
                          color: "#856404",
                          position: "relative",
                          paddingRight: "2.5rem",
                        }}
                      >
                        <i className="wi wi-star"></i>
                        {savedCity}
                        <span
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "0.5rem",
                            transform: "translateY(-50%)",
                            zIndex: 2,
                          }}
                        >
                          <button
                            className="btn btn-sm rounded-circle p-1"
                            style={{
                              width: "24px",
                              height: "24px",
                              background: "#dc3545",
                              border: "2px solid white",
                              color: "white",
                              fontSize: "12px",
                              lineHeight: "1",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 2px 6px rgba(220,53,69,0.15)",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveCity(savedCity);
                            }}
                            title="Remove city"
                            tabIndex={-1}
                          >
                            ×
                          </button>
                        </span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
          {error && (
            <motion.div
              className="alert alert-danger rounded-pill text-center shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: "linear-gradient(45deg, #dc3545, #c82333)" }}
            >
              <i className="wi wi-thunderstorm me-2"></i>
              {error}
            </motion.div>
          )}

          {/* Current Weather Card */}
          {weather && (
            <motion.div
              className="card border-0 shadow-lg mb-5 mx-auto"
              style={{
                maxWidth: "900px",
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: "20px",
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="row align-items-center">
                  <div className="col-md-4 text-center mb-4 mb-md-0">
                    <motion.i
                      className={`wi wi-${getWeatherIcon(
                        weather.weather[0].main
                      )}`}
                      style={{
                        fontSize: "5rem",
                        color: "#4caf50",
                        filter: "drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))",
                      }}
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    />
                    <div className="mt-3">
                      <h1 className="display-3 fw-bold mb-0">
                        {Math.round(weather.main.temp)}°
                      </h1>
                      <p className="fs-5 text-muted mb-0">
                        Feels like {Math.round(weather.main.feels_like)}°C
                      </p>
                    </div>
                  </div>

                  <div className="col-md-8">
                    <div className="mb-3">
                      <h2 className="fw-bold text-dark mb-1">{weather.name}</h2>
                      <p className="text-muted mb-2">{getCurrentDateTime()}</p>
                      <h4 className="text-capitalize fw-semibold">
                        {weather.weather[0].description}
                      </h4>
                    </div>

                    <div className="row g-3">
                      <div className="col-6 col-lg-3">
                        <div className="text-center p-3 rounded-3 bg-light">
                          <i className="wi wi-humidity text-info fs-2 mb-2"></i>
                          <div className="fw-bold">
                            {weather.main.humidity}%
                          </div>
                          <small className="text-muted">Humidity</small>
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="text-center p-3 rounded-3 bg-light">
                          <i className="wi wi-strong-wind fs-2 mb-2"></i>
                          <div className="fw-bold">
                            {Math.round(weather.wind.speed)} km/h
                          </div>
                          <small className="text-muted">Wind Speed</small>
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="text-center p-3 rounded-3 bg-light">
                          <i className="wi wi-barometer text-warning fs-2 mb-2"></i>
                          <div className="fw-bold">{weather.main.pressure}</div>
                          <small className="text-muted">Pressure (hPa)</small>
                        </div>
                      </div>
                      <div className="col-6 col-lg-3">
                        <div className="text-center p-3 rounded-3 bg-light">
                          <i className="wi wi-fog text-secondary fs-2 mb-2"></i>
                          <div className="fw-bold">
                            {weather.visibility / 1000} km
                          </div>
                          <small className="text-muted">Visibility</small>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mt-2">
                      <div className="col-6">
                        <div className="text-center p-3 rounded-3 bg-light">
                          <i className="wi wi-sunrise fs-2 mb-2"></i>
                          <div className="fw-bold">
                            {formatUnixTime(weather.sys.sunrise)}
                          </div>
                          <small>Sunrise</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="text-center p-3 rounded-3 background-light">
                          <i className="wi wi-sunset fs-2 mb-2"></i>
                          <div className="fw-bold">
                            {formatUnixTime(weather.sys.sunset)}
                          </div>
                          <small>Sunset</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5-Day Forecast */}
          {forecast && (
            <motion.div
              className="mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-center mb-4 fw-bold">
                <i className="wi wi-time-5 me-3"></i>
                5-Day Forecast
              </h2>
              <div className="row g-3 justify-content-center">
                {forecast.list
                  .filter((day) => new Date(day.dt * 1000).getHours() === 14)
                  .map((day, index) => (
                    <div key={index} className="col-lg-2 col-md-4 col-6">
                      <motion.div
                        className="card h-100 border-0 shadow-sm text-center"
                        style={{
                          borderRadius: "15px",
                          background:
                            "linear-gradient(135deg, #ffffff 0%, #f1f3f4 100%)",
                          transition: "all 0.3s ease",
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{
                          scale: 1.05,
                          y: -5,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                        }}
                      >
                        <div className="card-body p-3">
                          <h6 className="fw-bold mb-3">
                            {new Date(day.dt * 1000).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                              }
                            )}
                          </h6>
                          <i
                            className={`wi wi-${getWeatherIcon(
                              day.weather[0].main
                            )} text-success mb-3`}
                            style={{ fontSize: "2.5rem" }}
                          />
                          <div className="mb-2">
                            <div className="fw-bold fs-5 text-dark">
                              {Math.round(day.main.temp)}°C
                            </div>
                            <small className="text-muted">
                              Feels {Math.round(day.main.feels_like)}°C
                            </small>
                          </div>
                          <small className="text-capitalize text-muted">
                            {day.weather[0].description}
                          </small>
                        </div>
                      </motion.div>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Charts Section */}
          {forecast && (
            <motion.div
              className="row g-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="col-12">
                <div
                  className="card border-0 shadow-lg"
                  style={{ borderRadius: "20px" }}
                >
                  <div className="card-body p-4">
                    <h4 className="mb-4 fw-bold text-center">
                      <i className="wi wi-thermometer me-2"></i>
                      12-Hour Temperature Trend
                    </h4>
                    <div style={{ height: "350px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getHourlyChartData()}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e0e0e0"
                          />
                          <XAxis dataKey="time" stroke="#666" fontSize={12} />
                          <YAxis unit="°C" stroke="#666" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#ffffff",
                              border: "none",
                              borderRadius: "10px",
                              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="temp"
                            stroke="#4caf50"
                            strokeWidth={3}
                            dot={{ fill: "#4caf50", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: "#2e7d32" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Weather;
