const yargs = require('yargs');
const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs.options({ 
    a: { 
        demand: true,
        alias: 'address',
        description: 'Address to fetch weather',
        string: true
    } 
})
.help()
.alias('help', 'h')
.argv;

geocode.geocodeAddress(argv.address, (geoResult) => {
    if(typeof(result) === 'string') {
        console.info(result);
    } else {
        weather.getWeather(geoResult.lat, geoResult.lng, (weatherResult) => {
            console.log(weatherResult);
        });
    }
});