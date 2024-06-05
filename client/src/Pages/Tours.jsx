import React from 'react';
import Navbar from '../Components/Navbar';
import TourCard from '../Components/TourCard';
import CustomTourCard from '../Components/CustomTourCard';
import tourImage1 from '../Assets/3days.jpg';
import tourImage2 from '../Assets/4days.jpg';
import tourImage3 from '../Assets/5days.jpg';
import tourImage4 from '../Assets/6days.jpg';
import tourImage5 from '../Assets/7days.jpg';
import tourImage6 from '../Assets/8days.jpg';
import tourImage7 from '../Assets/9days.jpg';
import tourImage8 from '../Assets/10days.jpg';
import tourImage9 from '../Assets/12days.jpg';
import tourImage10 from '../Assets/15days.jpg';
import tourImageCustom from '../Assets/16days.jpg';




const Tours = () => {
  return (
    <div>
      <Navbar activeItem={'TOURS'} buttonState={'LOGIN'} buttonLoc={'/login'}/>
      <div className="flex flex-wrap justify-center">
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <TourCard
            days={3}
            imageSrc={tourImage1}
            buttonText="For more information"
            buttonLink="/more-info1"
          />
        </div>
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <TourCard
            days={4}
            imageSrc={tourImage2}
            buttonText="For more information"
            buttonLink="/more-info2"
          />
        </div>
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <TourCard
            days={5}
            imageSrc={tourImage3}
            buttonText="For more information"
            buttonLink="/more-info3"
          />
        </div>
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <TourCard
            days={6}
            imageSrc={tourImage4}
            buttonText="For more information"
            buttonLink="/more-info4"
          />
        </div>
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <TourCard
            days={7}
            imageSrc={tourImage5}
            buttonText="For more information"
            buttonLink="/more-info5"
          />
        </div>
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <TourCard
            days={8}
            imageSrc={tourImage6}
            buttonText="For more information"
            buttonLink="/more-info6"
          />
        </div>
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <TourCard
            days={9}
            imageSrc={tourImage7}
            buttonText="For more information"
            buttonLink="/more-info7"
          />
        </div>
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <TourCard
            days={10}
            imageSrc={tourImage8}
            buttonText="For more information"
            buttonLink="/more-info8"
          />
        </div>
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <TourCard
            days={12}
            imageSrc={tourImage9}
            buttonText="For more information"
            buttonLink="/more-info9"
          />
        </div>
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <TourCard
            days={15}
            imageSrc={tourImage10}
            buttonText="For more information" 
            buttonLink="/more-info10"
          />
        </div>
        <div className="w-48 sm:w-64 md:w-72 lg:w-1/4 m-4">
          <CustomTourCard
            imageSrc={tourImageCustom}
            buttonText="For more information"
            buttonLink="/more-info-custom"
            />
        {/* Add more TourCard components for different tours */}
      </div>
    </div>
    </div>
  )
}

export default Tours;
