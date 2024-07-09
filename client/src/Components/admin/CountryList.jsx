import React, { useState, useEffect } from 'react';

const CountryList = ({ field, form }) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = () => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const countryNames = data.map(country => country.name.common);
        countryNames.sort();
        setCountries(countryNames);
        setLoading(false);
      })
      .catch(error => console.error('Error fetching countries:', error));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <select
      {...field}
      className='input input-bordered w-full border-black'
    >
      <option value="">Select a country</option>
      {countries.map((country, index) => (
        <option key={index} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
};

export default CountryList;
