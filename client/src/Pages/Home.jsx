import React from 'react';
import Navbar from '../Components/Navbar';
import Homedash from '../Components/Homedash';

const Home = () => {

  return (
    <div>
        <Navbar activeItem={'HOME'} buttonState={'LOGIN'} buttonLoc={'/login'}/>
        <Homedash />
        
    </div>
  )
}

export default Home;