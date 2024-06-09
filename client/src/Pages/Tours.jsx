import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import instance from '../api';
import TourCard from '../Components/TourCard';
import CustomTourCard from '../Components/CustomTourCard';
import tourImageCustom from '../Assets/16days.jpg';

const Tours = () => {
  const [tourPackages, setTourPackages] = useState([]);

  useEffect(() => {
    const fetchTourPackages = async () => {
      try {
        const response = await instance.get('/tourPackages/getAllTourPackages');
        setTourPackages(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTourPackages();
  }, []);

  return (
    <div>
      <Navbar activeItem={'TOURS'} buttonState={'LOGIN'} buttonLoc={'/login'} />
      <div className="flex flex-wrap justify-center">
        {tourPackages.map(tourPackage => (
          <div key={tourPackage.PackageID} className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
            <TourCard
              name={tourPackage.Name}
              description={tourPackage.Description}
              price={tourPackage.Price}
              itinerary={tourPackage.Itinerary}
              days={tourPackage.NoOfDates}
              imageSrc={tourPackage.Photo}
              buttonText="For more information"
            />
          </div>
        ))}
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4 z-0">
          <CustomTourCard
            imageSrc={tourImageCustom}
            buttonText="For more information"
            buttonLink="/inquire"
          />
        </div>
      </div>
    </div>
  );
};

export default Tours;
