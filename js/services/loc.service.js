import { storageService } from './storage.service.js'

export const locService = {
    getLocs,
    saveLocation,
}

const locs = [
    {
        id: null,
        name: 'Greatplace',
        lat: 32.047104,
        lng: 34.832384,
        weather: null,
        createdAt: null,
        updatedAt: null,
    },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function saveLocation() {

}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}


