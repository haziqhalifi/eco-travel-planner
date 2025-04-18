import React, { useState } from "react";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "8e54d5510227752f8c346d3e9313a108";

  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setWeather(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">🌤 Weather Forecast</h1>

      <div className="input-group mb-3 w-50 mx-auto">
        <input
          type="text"
          className="form-control"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="btn btn-primary" onClick={getWeather}>
          Get Weather
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {weather && (
        <div className="card p-4 mt-3 mx-auto" style={{ maxWidth: "400px" }}>
          <h3>{weather.name}</h3>
          <p>
            <strong>Temperature:</strong> {weather.main.temp}°C
          </p>
          <p>
            <strong>Condition:</strong> {weather.weather[0].main}
          </p>
          <p>
            <strong>Humidity:</strong> {weather.main.humidity}%
          </p>
          <p>
            <strong>Wind:</strong> {weather.wind.speed} km/h
          </p>
        </div>
      )}
    </div>
  );
};

export default Weather;
