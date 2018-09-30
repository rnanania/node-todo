const request = require('request');

let geocodeAddress = (address, callback) => {
    let encodedAddress = encodeURIComponent(address);

    request({
        // Need to add the API Key to access google API.
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
        json: true
    }, (error, response, body) => {
        console.log(body.status);
        if(error || body.status === 'ZERO_RESULTS' || body.status === 'OVER_QUERY_LIMIT') {
            callback('Unable to fetch the Geo Location from google API');
        } else if(body.status === 'OK') {
            callback(body.results[0].geometry.location);
        }
    });
};

module.exports.geocodeAddress = geocodeAddress;