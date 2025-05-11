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
  const [uvIndex, setUvIndex] = useState(null);
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

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Weather Forecast</h1>
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
            className="form-control mr-2"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoFocus
          />
          <button className="btn btn-success" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="mb-4">
        <h5>Popular Cities:</h5>
        <div className="d-flex justify-content-center gap-2">
          {["New York", "London", "Tokyo", "Paris", "Sydney"].map((city) => (
            <button
              key={city}
              className="btn btn-secondary"
              onClick={() => handleGetWeather(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {weather && (
        <div className="card p-4 mt-3 mx-auto" style={{ maxWidth: "800px" }}>
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
          <h2>5-Day Forecast</h2>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {forecast.list
              .filter((day) => new Date(day.dt * 1000).getHours() === 14)
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
                className="card shadow-sm p-4 h-100"
                style={{ maxWidth: "600px", width: "100%" }}
              >
                <h4 className="mb-3">Additional Details</h4>
                <div className="d-flex flex-column gap-3 text-center">
                  <div>
                    <strong>Feels Like:</strong> {weather.main.feels_like}°C
                  </div>
                  <div>
                    <strong>Visibility:</strong> {weather.visibility / 1000} km
                  </div>
                  <div>
                    <strong>Sunrise:</strong>{" "}
                    {formatUnixTime(weather.sys.sunrise)}
                  </div>
                  <div>
                    <strong>Sunset:</strong>{" "}
                    {formatUnixTime(weather.sys.sunset)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather;
