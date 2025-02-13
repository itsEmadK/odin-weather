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

getCurrentWeather('semnan').then((r) => {
    console.log(r);
});
