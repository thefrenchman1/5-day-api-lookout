const API_KEY = "bc8b5055107bb898edb03a8b160c2fc3";

const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherList = document.querySelector(".weather-cards");
const btnList = document.querySelector(".btn-list");
const currentCity = document.querySelector("#current-city");
const currentTemp = document.querySelector("#current-temp");
const currentWind = document.querySelector("#current-wind");
const currentHum = document.querySelector("#current-humidity");
const currentMain = document.querySelector("#current-main");
const currentIco = document.querySelector("#current-icon");
const fiveDayCont = document.querySelector('.days-forecast');

document.addEventListener("DOMContentLoaded", function () {
    currentIco.classList.add("hidden");
    fiveDayCont.classList.add("hidden");
    const lsRecent = localStorage.getItem("recentSearch");
    if (lsRecent) {
        const stringArr = lsRecent.split(",");
        stringArr.forEach((item) => {
            const historyBtn = document.createElement("div");
            historyBtn.innerHTML = `<button class="location-btn">${item}</button>`;
            historyBtn.addEventListener("click", () => {
                getCityCoordinates(item);
            });
            btnList.appendChild(historyBtn);
        });
    }
});

const getCityCoordinates = (item) => {
    const cityName = item;
    if (!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;
    fetch(GEOCODING_API_URL)
        .then((res) => res.json())
        .then((data) => {
            if (!data.length) return alert(`I couldn't locate ${cityName}`);
            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert("An error occurred while fetching the coordinates!");
        });
};

searchButton.addEventListener("click", (e) => {
    getCityCoordinates(cityInput.value);
});

const getWeatherDetails = (cityName, lat, lon) => {
    const lsRecent = localStorage.getItem("recentSearch");
    if (lsRecent) {
        const stringArr = lsRecent.split(",");
        if (!stringArr.includes(cityName)) {
            updatedString = lsRecent + `,${cityName}`;
            localStorage.setItem("recentSearch", `${updatedString}`);
            const historyBtn = document.createElement("div");
            historyBtn.innerHTML = `<button class="location-btn">${cityName}</button>`;
            historyBtn.addEventListener("click", () => {
                getCityCoordinates(cityName);
            });
            btnList.appendChild(historyBtn);
        }
    } else {
        localStorage.setItem("recentSearch", `${cityName}`);
        const historyBtn = document.createElement("div");
        historyBtn.innerHTML = `<button class="location-btn">${cityName}</button>`;
        historyBtn.addEventListener("click", () => {
            getCityCoordinates(cityName);
        });
        btnList.appendChild(historyBtn);
    }
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial&cnt=35`;
    fetch(WEATHER_API_URL)
        .then((res) => res.json())
        .then((data) => {
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate) && uniqueForecastDays.length < 5) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });
            currentCity.innerText = data.city.name;
            currentTemp.innerText = `Temperature: ${data.list[0].main.temp} °F`;  // Update this line
            currentWind.innerText = `Wind Speed: ${data.list[0].wind.speed} M/S`;
            currentHum.innerText = `Humidity: ${data.list[0].main.humidity} %`;
            currentMain.innerText = `${data.list[0].weather[0].main}`;
            currentIco.src = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
            currentIco.classList.remove("hidden");
            fiveDayCont.classList.remove("hidden");
            weatherList.innerHTML = "";
            fiveDaysForecast.forEach((weatherItem) => {
                createWeatherCard(weatherItem);
            });
        })
        .catch(() => {
            alert("An error occurred while fetching weather data!");
        });
};

const createWeatherCard = (weatherItem) => {
    const date = new Date(weatherItem.dt_txt);
    const iconUrl = `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png`;
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `
        <h3>${date.toDateString()}</h3>
        <img src="${iconUrl}" alt="weather-icon" />
        <h4>Temp: ${weatherItem.main.temp}°F</h4>
        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
    `;
    weatherList.appendChild(card);
};