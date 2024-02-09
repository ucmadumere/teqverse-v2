const { State, City } = require('country-state-city');
const fs = require('fs');

// Get all states in Nigeria
const nigeriaStates = State.getStatesOfCountry('NG');

// Initialize an empty array to store all cities
let nigeriaCities = [];

// Loop through each state to fetch its cities
nigeriaStates.forEach(state => {
    const stateCities = City.getCitiesOfState(state.isoCode, 'NG');
    nigeriaCities = nigeriaCities.concat(stateCities);
});

// Write the list of cities to a JSON file
fs.writeFileSync('nigeria-cities.json', JSON.stringify(nigeriaCities, null, 2));

console.log('List of all cities in Nigeria has been saved to nigeria-cities.json');
