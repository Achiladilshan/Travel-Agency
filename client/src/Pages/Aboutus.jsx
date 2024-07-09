import React from 'react';
import Navbar from '../Components/Navbar';
import aboutUs from '../Assets/aboutUs.png'; // Import your image file

const Aboutus = () => {
  return (
    <div>
      <Navbar activeItem={'ABOUT US'} buttonState={'LOGIN'} buttonLoc={'/login'} />
      <img src={aboutUs} alt="aboutUs" className="w-full h-auto" /> {/* Image at the top */}

      {/* Content below the image */}
      <div className="container mx-auto mt-8 grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <div className="bg-white p-4   rounded shadow">
            <h2 className="text-lg font-bold  mb-4">About Us</h2>
            <p>
              Welcome to SWEN Tours and Travels, your premier Destination Management Company in the captivating island of Sri Lanka. Founded with a passion for exceptional service and a dedication to creating unforgettable experiences, SWEN stands out as a beacon of excellence in the travel industry.
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Our Mission</h2>
            <p>
              At SWEN, our mission is to redefine the standards of travel by providing unparalleled service, personalized attention, and authentic experiences that immerse our clients in the vibrant culture and natural beauty of Sri Lanka. We are committed to exceeding expectations, ensuring every journey with us is not just a trip, but a cherished memory to be cherished forever.
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Our Vision</h2>
            <p>
              Our vision is to be recognized as the leading provider of transformative travel experiences in Sri Lanka, setting the benchmark for excellence in service, innovation, and sustainability. We aim to inspire wanderlust and foster a deep appreciation for the rich tapestry of experiences that our island paradise has to offer.
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">What Sets Us Apart</h2>
            <p>
              At SWEN Tours and Travels, we pride ourselves on our distinguished team of knowledgeable, well-mannered, and personable tour guides. Trained to the highest standards, our guides are not just experts in the history, culture, and geography of Sri Lanka, but also passionate storytellers who go above and beyond to ensure every moment of your journey is filled with warmth, care, and genuine hospitality.
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Customized Experiences</h2>
            <p>
              We understand that every traveler is unique, which is why we offer fully customizable tour packages tailored to suit your individual preferences and interests. Whether you're seeking adventure, relaxation, cultural immersion, or a blend of it all, our team will work tirelessly to craft the perfect itinerary that reflects your desires and exceeds your expectations.
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Join Us on Your Next Adventure</h2>
            <p>
              Embark on a journey of discovery with SWEN Tours and Travels and unlock the wonders of Sri Lanka like never before. From pristine beaches to ancient ruins, lush tea plantations to bustling markets, let us be your trusted companion as you create memories to last a lifetime. Experience the difference with SWEN - where every moment matters, and every experience is extraordinary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aboutus;
