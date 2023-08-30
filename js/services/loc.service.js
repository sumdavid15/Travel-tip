import { storageService } from './storage.service.js'
import { hiddenGeoCodeKey } from './hiddenKey.js'

export const locService = {
    getLocs,
    saveLocation,
    updateLoc,
    getLocationByName,
}

let locs = storageService.load('location') || []

function getLocationByName(address) {
    const searchDB = storageService.load('searchDB') || {}

    if (searchDB[address]) {
        return Promise.resolve(searchDB[address])
    }

    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${hiddenGeoCodeKey.key}`)
        .then(res => {
            console.log('res:', res)
            const address = res.data.results[0].formatted_address;
            const addressLocation = res.data.results[0].geometry.location;

            searchDB[address] = addressLocation
            console.log('searchDB:', searchDB)
            storageService.save('searchDB', searchDB)

            return searchDB[address]
        })
}

function saveLocation(location, name) {
    const loc = {
        id: makeId(5),
        name: name,
        lat: location.lat,
        lng: location.lng,
        weather: null,
        createdAt: Date.now,
        updatedAt: null,
    }
    locs.push(loc)
    storageService.save('location', locs)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function makeId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
}

function updateLoc(loc) {
    locs = loc
    storageService.save('location', locs)
}
