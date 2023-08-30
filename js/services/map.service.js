import { hiddenKey } from './hiddenKey.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getClickedLocation,
}


// Var that is used throughout this Module (not global)
var gMap

let currLocation = {
    lat: null,
    lng: null,
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: { lat, lng },
            })
            infoWindow.open(gMap);
            // Configure the click listener.
            gMap.addListener("click", (mapsMouseEvent) => {
                // Close the current InfoWindow.
                console.log('mapsMouseEvent:', mapsMouseEvent)

                infoWindow.close();
                // Create a new InfoWindow.
                infoWindow = new google.maps.InfoWindow({
                    position: mapsMouseEvent.latLng,
                });

                currLocation.lat = infoWindow.position.lat()
                currLocation.lng = infoWindow.position.lng()

                console.log('currLocation:', currLocation)
                console.log('gMap:', gMap)

                infoWindow.setContent(
                    JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
                );
                infoWindow.open(gMap);
            })
            console.log('Map!', gMap)
        })
}

function addMarker(loc, title) {
    console.log('title:', title)
    console.log('loc:', loc)
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title,
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = hiddenKey.key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getClickedLocation() {
    return currLocation
}