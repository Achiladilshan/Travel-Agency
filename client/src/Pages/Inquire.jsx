import React, { useState } from 'react';

const Inquire = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    livingCountry: '',
    arrivalDate: '',
    departureDate: '',
    numAdults: '',
    numChildren: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Add your form submission logic here
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 rounded-md border-2 border-customYellow">
    <div className="max-w-md mx-auto my-8 p-6 bg-gray-100 rounded-md">
      <h2 className="text-2xl font-semibold flex justify-center mb-4 ">INQUIRY NOW</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="border-black border w-full p-2 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="border-black border w-full p-2 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Mobile:</label>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="border-black border w-full p-2 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Living Country:</label>
          <input type="text" name="livingCountry" value={formData.livingCountry} onChange={handleChange} className="border-black border w-full p-2 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Arrival Date:</label>
          <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} className="border-black border w-full p-2 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Departure Date:</label>
          <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} className="border-black border w-full p-2 rounded-md" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">No of Travellers:</label>
          <div className="flex">
            <div className="mr-4">
              <label>Adults: </label>
              <input type="number" name="numAdults" value={formData.numAdults} onChange={handleChange} className="border-black border w-20 p-2 rounded-md" />
            </div>
            <div>
              <label>Children: </label>
              <input type="number" name="numChildren" value={formData.numChildren} onChange={handleChange} className="border-black border w-20 p-2 rounded-md" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Message:</label>
          <textarea name="message" value={formData.message} onChange={handleChange} className="border-black border w-full h-48 p-2 rounded-md"></textarea>
        </div>
        <div className='flex justify-center'>
            <button type="submit" className="bg-customYellow text-white px-4 py-2  rounded-md hover:bg-yellow-600">Submit</button>
        </div>
        </form>
    </div>
    </div>
  );
}

export default Inquire;
