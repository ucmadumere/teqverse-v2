const { Country, State, City } = require('country-state-city');
const fs = require('fs');

// Get all countries
const countries = Country.getAllCountries();

// Get all states and cities for each country
const allData = countries.map(country => {
    const states = State.getStatesOfCountry(country.isoCode);
    const cities = states.reduce((cityList, state) => {
        const stateCities = City.getCitiesOfState(state.isoCode);
        if (stateCities.length === 0) {
            console.log(`No cities found for state: ${state.name}, ISO Code: ${state.isoCode}`);
        }
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

