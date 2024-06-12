import React, { useEffect, useRef, useState } from 'react';

const AutocompleteInput = ({ id, placeholder, onPlaceSelected, disabled, value }) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(value || ''); 

  useEffect(() => {
    const loadGoogleMapsAPI = (callback) => {
      if (window.google && window.google.maps) {
        callback();
        return;
      }

      const existingScript = document.getElementById('googleMaps');

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAVBI86obkebwHt55zzGlgU8rC6V9h8C4A&libraries=places&callback=initAutocomplete`;
        script.id = 'googleMaps';
        script.async = true;
        script.defer = true;
        window.initAutocomplete = callback;
        document.body.appendChild(script);
      } else {
        if (existingScript.getAttribute('async') === null) {
          existingScript.async = true;
        }
        if (existingScript.getAttribute('defer') === null) {
          existingScript.defer = true;
        }
        existingScript.onload = callback;
      }
    };

    const initAutocomplete = () => {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'LK' }, // Restrict to Sri Lanka
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place) {
          const selectedPlace = {
            name: place.name,
            formatted_address: place.formatted_address,
          };
          setInputValue(place.name);
          onPlaceSelected(selectedPlace);
        }
      });
    };

    loadGoogleMapsAPI(initAutocomplete);
  }, [id, onPlaceSelected]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      className="w-[45%] p-2 border border-gray-300 rounded bg-[#7272722b] text-black"
      disabled={disabled}
    />
  );
};

export default AutocompleteInput;



//AIzaSyAVBI86obkebwHt55zzGlgU8rC6V9h8C4A