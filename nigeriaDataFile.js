const fs = require('fs');
const ccsj = require('country-state-city');

// Get all countries
const countries = ccsj.getCountries();

// Get all states and cities for each country
const allData = countries.map(country => {
    const states = ccsj.getStatesByShort(country.shortName);
    const cities = states.reduce((cityList, state) => {
        const stateCities = ccsj.getCities(country.shortName, state.name);
        return [...cityList, ...stateCities];
    }, []);
    return {
        country,
        states,
        cities
    };
});

// Write the data to a JSON file
fs.writeFileSync('all-countries-data.json', JSON.stringify(allData, null, 2));

console.log('All countries data has been saved to all-countries-data.json');
