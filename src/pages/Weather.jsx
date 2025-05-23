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
import "../css/weather-icons.min.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");
  const [savedCities, setSavedCities] = useState([]);

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

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
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

  // --- Styling variables ---
  const cityBtnStyle = {
    borderRadius: "25px",
    fontWeight: "bold",
    padding: "0.5rem 1.25rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    transition: "background 0.2s, box-shadow 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const removeBtnStyle = {
    borderRadius: "50%",
    width: "1.5rem",
    height: "1.5rem",
    padding: 0,
    marginLeft: "0.5rem",
    fontWeight: "bold",
    lineHeight: "1.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.07)",
    background: "#e57373",
    color: "#fff",
    border: "none",
    transition: "background 0.2s",
  };

  // --- End styling variables ---

  return (
    <div
      className="min-vh-100 py-8"
      style={{
        background: "linear-gradient(135deg, #e0f7fa 0%, #fffde4 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto my-8">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h1 className="mb-4 text-center">Weather Forecast</h1>
          <div className="input-group mb-3 w-50 mx-auto">
            <form
              className="d-flex w-100"
              onSubmit={(e) => {
                e.preventDefault();
                handleGetWeather();
              }}
              style={{ gap: "0.5rem" }}
            >
              <input
                type="text"
                className="form-control mr-2 rounded-pill shadow-sm"
                placeholder="Enter city name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                autoFocus
                style={{ border: "2px solid #4caf50" }}
              />
              <button
                className="btn btn-success rounded-pill px-4 shadow"
                type="submit"
              >
                Search
              </button>
            </form>
            {weather && (
              <div className="text-center mt-2">
                <button
                  className="btn btn-outline-success rounded-pill px-4 shadow"
                  onClick={handleSaveCity}
                  disabled={!weather || savedCities.includes(weather.name)}
                >
                  Save City
                </button>
              </div>
            )}
          </div>

          {/* --- Enhanced Popular Cities & Current Location --- */}
          <div className="mb-4">
            <h5 className="text-center">Popular Cities:</h5>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              <button
                className="btn btn-primary shadow"
                style={cityBtnStyle}
                onClick={handleGetLocationWeather}
              >
                <i className="wi wi-day-sunny"></i> My Location
              </button>
              {["New York", "London", "Tokyo", "Paris", "Sydney"].map(
                (city) => (
                  <button
                    key={city}
                    className="btn btn-secondary shadow"
                    style={cityBtnStyle}
                    onClick={() => handleGetWeather(city)}
                  >
                    <i className="wi wi-city"></i> {city}
                  </button>
                )
              )}
            </div>

            {/* --- Enhanced Saved Cities List --- */}
            {savedCities.length > 0 && (
              <>
                <h6 className="text-center mt-3">Saved Cities:</h6>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  {savedCities.map((city) => (
                    <div key={city} className="d-flex align-items-center">
                      <button
                        className="btn btn-outline-secondary d-flex align-items-center"
                        style={{
                          ...cityBtnStyle,
                          paddingRight: "0.5rem",
                          marginRight: "0.5rem",
                          position: "relative",
                        }}
                        onClick={() => handleGetWeather(city)}
                      >
                        <i className="wi wi-city"></i> {city}
                        <button
                          className="btn btn-sm btn-danger"
                          style={removeBtnStyle}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCity(city);
                          }}
                          title="Remove"
                          onMouseOver={(e) =>
                            (e.currentTarget.style.background = "#d32f2f")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.background = "#e57373")
                          }
                        >
                          &times;
                        </button>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
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
                      } animate__animated animate__pulse animate__infinite`}
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                  </div>
                  <div className="col col-md-4">
                    <h1>{Math.round(weather.main.temp)}°C</h1>
                    <p>
                      {weather.weather[0].main === "Clear"
                        ? "Sunny"
                        : weather.weather[0].main === "Clouds"
                        ? "Cloudy"
                        : weather.weather[0].main}
                    </p>
                  </div>
                  <table className="table table-bordered mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Humidity</th>
                        <th>Wind</th>
                        <th>Pressure</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{weather.main.humidity}%</td>
                        <td>{Math.round(weather.wind.speed)} km/h</td>
                        <td>{weather.main.pressure} hPa</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {forecast && (
            <div className="mt-5 mb-5">
              <h2 className="text-center">5-Day Forecast</h2>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                {forecast.list
                  .filter((day) => new Date(day.dt * 1000).getHours() === 14)
                  .map((day, index) => (
                    <div
                      key={index}
                      className="card p-3 text-center shadow-sm border-0"
                      style={{
                        width: "150px",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.07)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
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
                      <p>
                        <strong>{Math.round(day.main.temp)}°C</strong>{" "}
                        {Math.round(day.main.feels_like)}°C
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {(forecast || weather) && (
            <div className="row justify-content-center mb-5">
              {forecast && (
                <div className="col-md-6 mb-4 d-flex justify-content-center">
                  <div
                    className="card shadow-sm p-4 h-100"
                    style={{ maxWidth: "600px", width: "100%" }}
                  >
                    <h4 className="mb-3">Hourly Temperature</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={getHourlyChartData()}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis unit="°C" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="temp"
                          stroke="#007bff"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              {weather && (
                <div className="col-md-6 mb-4 d-flex justify-content-center">
                  <div
                    className="card p-4 h-100"
                    style={{
                      maxWidth: "600px",
                      width: "100%",
                    }}
                  >
                    <h4 className="mb-3">Additional Details</h4>
                    <div className="d-flex flex-wrap gap-3 justify-content-center">
                      <div className="detail-box text-center m-2 p-3 rounded shadow-sm bg-white">
                        <i
                          className="wi wi-thermometer text-primary"
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <div className="mt-2">
                          <strong>Feels Like</strong>
                          <div>{weather.main.feels_like}°C</div>
                        </div>
                      </div>
                      <div className="detail-box text-center m-2 p-3 rounded shadow-sm bg-white">
                        <i
                          className="wi wi-fog text-info"
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <div className="mt-2">
                          <strong>Visibility</strong>
                          <div>{weather.visibility / 1000} km</div>
                        </div>
                      </div>
                      <div className="detail-box text-center m-2 p-3 rounded shadow-sm bg-white">
                        <i
                          className="wi wi-sunrise text-warning"
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <div className="mt-2">
                          <strong>Sunrise</strong>
                          <div>{formatUnixTime(weather.sys.sunrise)}</div>
                        </div>
                      </div>
                      <div className="detail-box text-center m-2 p-3 rounded shadow-sm bg-white">
                        <i
                          className="wi wi-sunset text-danger"
                          style={{ fontSize: "2rem" }}
                        ></i>
                        <div className="mt-2">
                          <strong>Sunset</strong>
                          <div>{formatUnixTime(weather.sys.sunset)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
