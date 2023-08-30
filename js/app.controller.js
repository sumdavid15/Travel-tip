import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onAdd = onAdd

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
            // console.log('Locations:', locs)
            // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)

            const locationContainer = document.querySelector('.location-Container')
            locationContainer.innerHTML = locs.map(loc => renderLocs(loc)).join('')
        })
}

function renderLocs(loc) {
    return `
    <div class="card">
      <div class="loc-name">${loc.name}</div>
      <button class="btn go-btn" onclick="onPanTo(${loc.lat, loc.lng})">Go</button>
      <button class="btn delete-btn" onclick="onDelete(${loc.id})">Delete</button>
    </div>`
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat, lng) {
    mapService.panTo(lat, lng)
}

function onAdd() {
    const locationName = prompt('Name the place')
    locService.saveLocation(mapService.getClickedLocation(), locationName)
}