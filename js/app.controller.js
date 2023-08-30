import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onAdd = onAdd
window.onDelete = onDelete
window.onSearchLocation = onSearchLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')

    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            renderLocationTable(locs)
        })
}

function renderLocationTable(locs) {
    const locationContainer = document.querySelector('.location-Container')
    locationContainer.innerHTML = locs.map(loc => renderLocs(loc)).join('')
}

function renderLocs(loc) {
    return `
    <div class="card">
      <div class="loc-name">${loc.name}</div>
      <button class="btn go-btn" onclick="onPanTo(${loc.lat},${loc.lng})">Go</button>
      <button class="btn delete-btn" onclick="onDelete('${loc.id}')">Delete</button>
    </div>`
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            onPanTo(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.error('err!!!', err.message)
        })
}

function onPanTo(lat, lng) {
    mapService.panTo(lat, lng)
}

function onAdd() {
    const locationName = prompt('Name the place')
    locService.saveLocation(mapService.getClickedLocation(), locationName)
}

function onDelete(id) {
    locService.getLocs()
        .then(locations => {
            const locationIdx = locations.findIndex(loc => loc.id === id)
            locations.splice(locationIdx, 1)
            locService.updateLoc(locations)
            renderLocationTable(locations)
        })
}

function onSearchLocation(ev) {
    ev.preventDefault()
    const inputEl = document.querySelector('.search-input')
    const value = inputEl.value
    locService.getLocationByName(value).then(res => {
        onPanTo(res.lat, res.lng)
    })
}