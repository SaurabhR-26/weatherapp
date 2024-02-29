import React from "react";
import "./weather.css";
import axios from "axios";
import { useState } from "react";

function Weather() {
  const apiKey = "d6751a3b922769bddbe675d83b2a80eb";
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

  const [sVal, changeVal] = useState("");
  const [weatherIcon, changeWeatherIcon] = useState("./images/rain.png");
  const [temp, changeTemp] = useState(0.0);
  const [city, changeCity] = useState("");
  const [humidity, changeHumidity] = useState(0);
  const [windSpeed, changeWindSpeed] = useState(0);
  const [tempMode, changeTempMode] = useState(0);
  const [myArray, updateMyArray] = useState([]);

  const updateMode = (mode) => {
    if (mode === 0) {
      if (tempMode !== 0) {
        changeTempMode(0);
        changeTemp(Math.floor(((temp - 32) * 5) / 9));
      }
    } else {
      if (tempMode !== 1) {
        changeTempMode(1);
        changeTemp(Math.round((temp * 9) / 5 + 32));
      }
    }
  };

  const updateVal = (msg) => {
    changeVal(msg);
  };

  const handleSearch = async (city) => {
    console.log("handlesearch called");
    if (city.length === 0) {
      changeCity(`No city selected`);
      return;
    }

    let tmp = false;
    myArray.forEach((ele) => {
      if (ele === city) tmp = true;
    });

    if (tmp === false) updateMyArray((arr) => [...arr, city]);

    try {
      axios
        .get(apiUrl + city + `&appid=${apiKey}`)
        .then((res) => {
          if (res.status === 404) {
            changeCity("invalid city name");
            return;
          }
          console.log(res);
          let data = res.data;
          changeCity(data.name);
          changeTemp(Math.round(data.main.temp));
          changeHumidity(data.main.humidity);
          changeWindSpeed(data.wind.speed);

          if (data.weather[0].main === "Clouds") {
            changeWeatherIcon("./images/clouds.png");
          } else if (data.weather[0].main === "Clear") {
            changeWeatherIcon("./images/clear.png");
          } else if (data.weather[0].main === "Rain") {
            changeWeatherIcon("./images/rain.png");
          } else if (data.weather[0].main === "Drizzle") {
            changeWeatherIcon("./images/drizzle.png");
          } else if (data.weather[0].main === "Mist") {
            changeWeatherIcon("./images/mist.png");
          }
        })
        .catch((error) => {
          changeCity("No such city !");
          changeTemp(0);
          changeHumidity(0);
          changeWindSpeed(0);
        });
    } catch (err) {}
  };

  return (
    <div className="card">
      <div className="search">
        <input
          type="text"
          placeholder="Enter city name"
          spellCheck={false}
          value={sVal}
          onChange={(evt) => updateVal(evt.target.value)}
        />
        <button>
          <img
            src={require("./images/search.png")}
            alt="Search"
            onClick={() => {
              handleSearch(sVal);
            }}
          />
        </button>
      </div>

      <div className="fontutil flexutil">
        <h1>Recent Searches: </h1>
        <div>
          {myArray.map((c) => (
            <p>{c}</p>
          ))}
        </div>
      </div>

      <div className="weather">
        <img
          src={require(`${weatherIcon}`)}
          alt="Weather Icon"
          className="weather-icon"
        />
        <h1 className="temp">
          {temp}
          {tempMode === 0 ? "°C" : "°F"}
        </h1>
        <h2 className="city">{city}</h2>
        <div className="details">
          <div className="col">
            <img src={require("./images/humidity.png")} alt="Humidity Icon" />
            <div>
              <p className="humidity">{humidity}%</p>
              <p>Humidity</p>
            </div>
          </div>
          <div className="col">
            <img src={require("./images/wind.png")} alt="Wind Icon" />
            <div>
              <p className="wind">{windSpeed} kmph</p>
              <p>Wind Speed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="temperature">
        <button
          onClick={() => {
            updateMode(0);
          }}
        >
          Celcius
        </button>
        <button
          onClick={() => {
            updateMode(1);
          }}
        >
          Fahrenheit
        </button>
      </div>
    </div>
  );
}

export default Weather;
