import { storageService } from './storage.service.js'
import { hiddenKey } from './hiddenKey.js'

export const locService = {
    getLocs,
    saveLocation,
    updateLoc,
}

let locs = storageService.load('location') || []

function getLatLangByName(address) {
    const searchDB = storageService.load('searchDB') || {}

    if (searchDB[address]) {
        return Promise.resolve(searchDB[address])
    }

    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${hiddenKey.key}`)
        .then(res => {
            console.log('res:', res)
            console.log(' res.data:', res.data)
            // storageService.save('searchDB')
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
