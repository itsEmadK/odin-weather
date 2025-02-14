async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.status);
    }
    const json = await response.json();
    return json;
}

async function getCurrentWeather(city) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2CresolvedAddress%2Ctemp%2Cfeelslike%2Chumidity%2Cwindspeed%2Cuvindex%2Cconditions%2Cdescription%2Cicon&include=remote%2Cobs%2Ccurrent%2Cfcst&key=T3K39GSEC83MWTCTJQVNUSYSN&contentType=json`;
    const weatherJson = await loadJson(url);
    const address = weatherJson.resolvedAddress;
    const { currentConditions } = weatherJson;
    const {
        temp,
        humidity,
        conditions,
        feelslike: feelsLike,
        windspeed: windSpeed,
    } = currentConditions;
    const currentWeather = {
        address,
        conditions,
        temp,
        feelsLike,
        humidity,
        windSpeed,
    };
    return currentWeather;
}

function celsiusToFahrenheit(temp) {
    let f = (temp * 9) / 5;
    f += 32;
    return +f.toFixed(2);
}

function updateWeatherInfoDisplay(weather, isCelsius = true, isKPH = true) {
    const conditionDiv = document.querySelector('.condition');
    const addressDiv = document.querySelector('.address');
    const tempDiv = document.querySelector('.temp');
    const fellsLikeDiv = document.querySelector('.feels-like');
    const humidityDiv = document.querySelector('.humidity');
    const windDiv = document.querySelector('.wind');

    conditionDiv.innerText = weather.conditions;
    addressDiv.innerText = weather.address;

    const temp = isCelsius ? weather.temp : celsiusToFahrenheit(weather.temp);
    tempDiv.innerText = temp;

    const feelsLike = isCelsius
        ? weather.feelsLike
        : celsiusToFahrenheit(weather.feelsLike);

    fellsLikeDiv.innerText = `FEELS LIKE: ${feelsLike}`;
    humidityDiv.innerText = `HUMIDITY: ${weather.humidity}%`;
    windDiv.innerText = `WIND: ${weather.windSpeed} ${isKPH ? 'KPH' : 'MPH'}`;

    const tempSymbol = '°';
    const tempLetter = isCelsius ? 'C' : 'F';
    const tempSymbolSup = document.createElement('sup');
    tempSymbolSup.classList.add('temp-symbol');
    tempSymbolSup.innerText = tempSymbol + tempLetter;
    tempDiv.appendChild(tempSymbolSup.cloneNode(true));
    fellsLikeDiv.appendChild(tempSymbolSup.cloneNode(true));

    const condition = weather.conditions.toLowerCase();
    let cssClass = '';
    if (condition.includes('rain')) {
        cssClass = 'rainy';
    } else if (condition.includes('snow')) {
        cssClass = 'snowy';
    } else if (condition.includes('partially')) {
        cssClass = 'partially-cloudy';
    } else if (condition.includes('cloudy')) {
        cssClass = 'cloudy';
    } else if (condition.includes('overcast')) {
        cssClass = 'overcast';
    } else if (condition.includes('clear')) {
        cssClass = 'sunny';
    }
    document.body.classList = [];
    document.body.classList.add(cssClass);
}

let currentWeather = null;
const cityInput = document.querySelector('#city');
cityInput.value = 'Tehran';
getCurrentWeather('tehran').then((weather) => {
    updateWeatherInfoDisplay(weather);
    currentWeather = weather;
});

const submitCityButton = document.querySelector('button.submit-city');
submitCityButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const weatherDiv = document.querySelector('div.weather');
    weatherDiv.classList.add('loading');
    const city = cityInput.value;
    try {
        const weather = await getCurrentWeather(city);
        updateWeatherInfoDisplay(weather);
        currentWeather = weather;
    } catch (error) {
        const errorSpan = document.querySelector('span.error');
        errorSpan.classList.add('visible');
        cityInput.classList.add('error');
        if (+error.message === 400) {
            errorSpan.innerText = 'City info is not available :(';
        } else {
            errorSpan.innerText = error.message;
        }
    }
    weatherDiv.classList.remove('loading');
});

cityInput.addEventListener('input', () => {
    const errorSpan = document.querySelector('span.error');
    cityInput.classList.remove('error');
    errorSpan.classList.remove('visible');
});

const celsiusButton = document.querySelector('button.celsius');
const fahrenheitButton = document.querySelector('button.fahrenheit');

celsiusButton.addEventListener('click', () => {
    celsiusButton.classList.add('selected');
    fahrenheitButton.classList.remove('selected');
    updateWeatherInfoDisplay(currentWeather, true);
});

fahrenheitButton.addEventListener('click', () => {
    celsiusButton.classList.remove('selected');
    fahrenheitButton.classList.add('selected');
    updateWeatherInfoDisplay(currentWeather, false);
});
