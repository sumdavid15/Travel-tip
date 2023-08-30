import { storageService } from './storage.service.js'

export const locService = {
    getLocs,
    saveLocation,
    updateLoc,
}

let locs = storageService.load('location') || []

function getLatlangByName(name) {
    const searchDB = loadFromStorage(STORAGE_KEY) || {}

    if (searchDB[name]) {
        return Promise.resolve(searchDB[name])
    }

    return axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&videoEmbeddable=true&type=video&key=${YT_KEY}&q=${value}`).then(res => res.data)
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
