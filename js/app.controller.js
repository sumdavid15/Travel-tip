import { locService } from "./services/loc.service.js"
import { mapService } from "./services/map.service.js"
import { weatherService } from "./services/weather.service.js"

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onAdd = onAdd
window.onDelete = onDelete
window.onSearchLocation = onSearchLocation
window.onCopyLocation = onCopyLocation

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log("Map is ready")
    })
    .then(onGetUserPos)
    // check if there is query params ?lat=xxx&lng=xxx
    .then(() => {
      const urlParams = new URLSearchParams(window.location.search)
      const lat = +urlParams.get("lat")
      const lng = +urlParams.get("lng")
      console.log("lat:", lat)
      console.log("lng:", lng)
      if (lat && lng) {
        onPanTo(lat, lng)
      } else {
        onGetUserPos()
      }
    })
    .catch(() => console.log("Error: cannot init map"))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log("Getting Pos")
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker(locObj) {
  console.log("Adding a marker")

  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log("locs:", locs)
    renderMarker(locs)
    renderLocationTable(locs)
  })
}

function renderMarker(locs) {
  locs.forEach((loc) =>
    mapService.addMarker({ lat: loc.lat, lng: loc.lng }, loc.name)
  )
}

function renderWeather(weather) {
  const weatherContainer = document.querySelector(".weather-Container")
  weatherContainer.innerHTML = createWeatherHtml(weather)
}

function createWeatherHtml(weather) {
  return `
     <div>
        <h1>Weather Today</h1>
        <img src="http://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="">
        <div class="address">${weather.address}, <p>${weather.condition}</p></div>
        <div class="temp-container"><p class="temp">${weather.currTemp}°C</p>from ${weather.minTemp} to ${weather.maxTemp} °C, wind ${weather.windSpeed} kph</div>
     </div>`
}

function renderLocationTable(locs) {
  const locationContainer = document.querySelector(".location-Container")
  locationContainer.innerHTML = locs.map((loc) => renderLocs(loc)).join("")
}

function renderLocs(loc) {
  return `
    <div class="card">
      <div class="loc-name">${loc.name}</div>
      <div>
      <button class="btn go-btn" onclick="onPanTo(${loc.lat},${loc.lng})"><i class="fas fa-map-marker-alt"></i></button>
      <button class="btn delete-btn" onclick="onDelete('${loc.id}')"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>`
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      onPanTo(pos.coords.latitude, pos.coords.longitude)
    })
    .catch((err) => {
      console.error("err!!!", err.message)
    })
}

function onPanTo(lat, lng) {
  mapService.panTo(lat, lng)
  weatherService.getLocationWeather(lat, lng).then((res) => {
    renderWeather(res)
    document.querySelector("#currLoc").innerText = res.address
    // update the url with the search query
    window.history.pushState("", "", `?lat=${lat}&lng=${lng}`)
  })
}

function onAdd() {
  const locationName = prompt("Name the place")
  if (!locationName) return
  const currLocation = mapService.getClickedLocation()

    if (!currLocation.lat) return
    weatherService.getLocationWeather(currLocation.lat, currLocation.lng).then(res => {
        locService.saveLocation(mapService.getClickedLocation(), locationName, res)
        onGetLocs()
        mapService.closeInfoWindow()
    })
}

function onDelete(id) {
  locService.getLocs().then((locations) => {
    const locationIdx = locations.findIndex((loc) => loc.id === id)
    locations.splice(locationIdx, 1)
    locService.updateLoc(locations)
    renderLocationTable(locations)
  })
}

function onSearchLocation(ev) {
  ev.preventDefault()
  const inputEl = document.querySelector(".search-input")
  const value = inputEl.value

  locService.getLocationByName(value).then((res) => {
    onPanTo(res.lat, res.lng)
  })
  inputEl.value = ""
}

function onCopyLocation() {
  const url = window.location.href
  navigator.clipboard.writeText(url)
}
