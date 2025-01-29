import axios from "axios";

const response = await axios.get(
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
);
const countriesList = response.data.objects.countries.geometries.map(
  (country) => country.properties.name
);

const invalidCountries = ["eSwatini", "Antarctica", "Czechia", "Somaliland"];
const validCountries = countriesList.filter(
  (country) => !invalidCountries.includes(country)
);

return validCountries;
