const request = require('request');

let getWeather = (lat, lng, callback) => {
    request({
        url: `https://api.forecast.io/forecast/4a04d1c42fd9d32c97a2c291a32d5e2d/${lat},${lng}`,
        json: true
      }, (error, response, body) => {
        if (error) {
          callback('Unable to connect to Forecast.io server.');
        } else if (response.statusCode === 400) {
          callback('Unable to fetch weather.');
        } else if (response.statusCode === 200) {
          callback(body.currently);
        }
      });
};


module.exports.getWeather = getWeather;