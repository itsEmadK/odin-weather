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

function updateWeatherInfoDisplay(weather, isCelsius = true, isKPH = true) {
    const conditionDiv = document.querySelector('.condition');
    const addressDiv = document.querySelector('.address');
    const tempDiv = document.querySelector('.temp');
    const fellsLikeDiv = document.querySelector('.feels-like');
    const humidityDiv = document.querySelector('.humidity');
    const windDiv = document.querySelector('.wind');

    conditionDiv.innerText = weather.conditions;
    addressDiv.innerText = weather.address;
    tempDiv.innerText = weather.temp;
    fellsLikeDiv.innerText = weather.feelsLike;
    humidityDiv.innerText = weather.humidity;
    windDiv.innerText = `${weather.windSpeed} ${isKPH ? 'KPH' : 'MPH'}`;

    const tempSymbol = '°';
    const tempLetter = isCelsius ? 'C' : 'F';
    const tempSymbolSup = document.createElement('sup');
    tempSymbolSup.classList.add('temp-symbol');
    tempSymbolSup.innerText = tempSymbol + tempLetter;
    tempDiv.appendChild(tempSymbolSup.cloneNode(true));
    fellsLikeDiv.appendChild(tempSymbolSup.cloneNode(true));
}

const submitCityButton = document.querySelector('button.submit-city');
submitCityButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const cityInput = document.querySelector('#city');
    const city = cityInput.value;
    try {
        const weather = await getCurrentWeather(city);
        updateWeatherInfoDisplay(weather);
    } catch (error) {
        console.log(error);
    }
});
