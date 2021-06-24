const request = require('request')

const geocode = (address, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=651488e62946b72e0601cf54c6e56ac9&query='+address;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        } else if (body.message == 'Not Authorized - Invalid Token') {
            callback(body.message, undefined)
        } else if (body.features?.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, {
                latitude: body.location.lat,
                longitude: body.location.lon,
                location: body.location.name
            })
        }
    })
}

module.exports = geocode