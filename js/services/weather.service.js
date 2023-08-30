import { hiddenWeatherKey } from "./hiddenKey.js"

export const weatherService = {
    getLocationWeather,
}

function getLocationWeather(lat, lng) {

    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${hiddenWeatherKey.key}`)
        .then(res => res.data).then(data => {
            console.log('data:', data)
            const cTemp = 273.15

            const weather = {
                condition: data.weather[0].description,
                address: data.name,
                minTemp: Math.round(data.main.temp_min - cTemp),
                maxTemp: Math.round(data.main.temp_max - cTemp),
                currTemp: Math.round(data.main.temp - cTemp),
                windSpeed: data.wind.speed,
                icon: data.weather[0].icon,
            }
            return weather
        })
}

// weatherService.getLocationWeather(32.079, 34.90)