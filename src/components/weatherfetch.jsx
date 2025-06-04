import { useState } from "react";

function WeatherFetch() {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const API_KEY = '8a7bd9f10e620b4138dc834bf36dc4a2';

    const fetchWeather = async () => {
        try {
            if (!city) {
                setError("Indtast venligst et bynavn");
                return;
            }

            const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
            const geoData = await geoResponse.json();

            if (geoData.length === 0) {
                setError("Byen blev ikke fundet");
                setWeather(null);
                setForecast(null);
                return;
            }

            const { lat, lon, name } = geoData[0];

            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const weatherData = await weatherResponse.json();

            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
            const forecastData = await forecastResponse.json();

            setError("");
            setWeather({
                city: name,
                temp: Math.round(weatherData.main.temp),
                feels_like: Math.round(weatherData.main.feels_like),
                humidity: weatherData.main.humidity,
                wind: Math.round(weatherData.wind.speed),
                icon: weatherData.weather[0].icon,
            });

            const dailyForecasts = forecastData.list.reduce((acc, item) => {
                const date = new Date(item.dt * 1000).toLocaleDateString();
                if (!acc[date]) {
                    acc[date] = {
                        date: date,
                        temp: Math.round(item.main.temp),
                        feels_like: Math.round(item.main.feels_like),
                        humidity: item.main.humidity,
                        wind: Math.round(item.wind.speed),
                        icon: item.weather[0].icon,
                    };
                }
                return acc;
            }, {});

            setForecast(Object.values(dailyForecasts));

        } catch (error) {
            setError("Der opstod en fejl ved hentning af vejrdata");
            setWeather(null);
            setForecast(null);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchWeather();
    };

    return (
        <div className="weather-container">
            <div className="search-section">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder="Indtast by navn"
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Tjek Vejret</button>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>

            {weather && (
                <div className="current-weather">
                    <h2>{weather.city}</h2>
                    <div className="weather-details">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
                            alt="Weather icon"
                        />
                        <div className="temperature">
                            <p className="temp-main">{weather.temp}°C</p>
                            <p className="feels-like">Føltes som: {weather.feels_like}°C</p>
                        </div>
                        <div className="conditions">
                            <p>Fugtighed: {weather.humidity}%</p>
                            <p>Vind: {weather.wind} m/s</p>
                        </div>
                    </div>
                </div>
            )}

            {forecast && (
                <div className="forecast">
                    <h3>Ugens Vejrudsigt</h3>
                    <div className="forecast-container">
                        {forecast.map((day, index) => (
                            <div key={index} className="forecast-day">
                                <p className="date">{day.date}</p>
                                <img
                                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                                    alt="Weather icon"
                                />
                                <p className="temp">{day.temp}°C</p>
                                <div className="details">
                                    <p>Fugtighed: {day.humidity}%</p>
                                    <p>Vind: {day.wind} m/s</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default WeatherFetch;