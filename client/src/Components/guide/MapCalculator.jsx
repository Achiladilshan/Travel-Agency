import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Autocomplete, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const containerStyle = {
  width: '800px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

const MapCalculator = () => {
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [tripPrice, setTripPrice] = useState(null);

  const startAutocomplete = useRef(null);
  const endAutocomplete = useRef(null);

  const onStartPlaceChanged = () => {
    if (startAutocomplete.current) {
      const place = startAutocomplete.current.getPlace();
      if (place && place.formatted_address) {
        setStartLocation(place.formatted_address);
      } else {
        toast.error('Invalid starting point');
      }
    }
  };

  const onEndPlaceChanged = () => {
    if (endAutocomplete.current) {
      const place = endAutocomplete.current.getPlace();
      if (place && place.formatted_address) {
        setEndLocation(place.formatted_address);
      } else {
        toast.error('Invalid destination');
      }
    }
  };

  const calculateRoute = () => {
    if (!startLocation || !endLocation) {
      toast.error('Please select both starting point and destination');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: startLocation,
        destination: endLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
          const distance = result.routes[0].legs[0].distance.value / 1000; // distance in km
          const price = calculatePrice(distance);
          setTripPrice(distance);
        } else {
          toast.error('Could not calculate route');
        }
      }
    );
  };

  const calculatePrice = (distance) => {
    const basePrice = 1; // Base price in your currency
    const pricePerKm = 1; // Price per kilometer
    return basePrice + (pricePerKm * distance);
  };

  return (
    <div>
      <ToastContainer />
      <LoadScript googleMapsApiKey="AIzaSyAVBI86obkebwHt55zzGlgU8rC6V9h8C4A" libraries={['places']}>
        <div>
          <Autocomplete
            onLoad={(autocomplete) => (startAutocomplete.current = autocomplete)}
            onPlaceChanged={onStartPlaceChanged}
          >
            <input
              type="text"
              placeholder="Enter starting point"
              className="input input-bordered w-full mb-4"
            />
          </Autocomplete>

          <Autocomplete
            onLoad={(autocomplete) => (endAutocomplete.current = autocomplete)}
            onPlaceChanged={onEndPlaceChanged}
          >
            <input
              type="text"
              placeholder="Enter destination"
              className="input input-bordered w-full mb-4"
            />
          </Autocomplete>

          <button className="btn btn-primary" onClick={calculateRoute}>
            Calculate Route
          </button>
        </div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={(map) => setMap(map)}
        >
          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
            />
          )}
        </GoogleMap>
      </LoadScript>

      {tripPrice !== null && (
        <div className='m-2'>
          <h2 className='text-black font-semibold'>Trip Distance {tripPrice}Km</h2>
        </div>
      )}
    </div>
  );
};

export default MapCalculator;
