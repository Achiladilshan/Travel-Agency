import React, { useState } from 'react';
import { HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import LoginImage from '../Assets/LoginImage.png';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import instance from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userData , setUserdata] = useState({});  
  const navigate = useNavigate();


    const validateEmail = (email) => {
      // Regular expression for basic email validation
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async () => {

    console.log('Logging in...');

    // Validate email and password
  if (!email.trim() || !password.trim()) {
    setEmailError(!email.trim() ? 'Please enter an email' : '');
    setPasswordError(!password.trim() ? 'Please enter a password' : '');
    return;
  }
  
  // Validate email format
  if (!validateEmail(email)) {
    setEmailError('Please enter a valid email address');
    return;
  }

    try {
      // Perform authentication logic here
      const response = await fetch('http://localhost:3001/auth/login', {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({email, password }),
      });
      console.log("ok");
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      const {token} = await response.json();
      console.log(token);
      localStorage.setItem('access_token', token);

      try{
        const resRole = await instance.get('/auth/current-user');
        // console.log(resRole.data);
        setUserdata(resRole.data);
        localStorage.setItem('role', resRole.data?.user?.role)
        // const role = userData?.user?.role;
        console.log(resRole.data?.user?.role);
        switch (resRole.data?.user?.role) {
          case 'Customer':
            navigate('/Customer-Dashboard');
            break;
          case 'customer':
            navigate('/Customer-Dashboard');
            break;
          case 'Guide':
            navigate('/guide-dashboard');
            break;
          case 'guide':
            navigate('/guide-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'Staff':
            navigate('/staff-dashboard');
            break;
          case 'staff':
            navigate('/staff-dashboard');
            break;
          case 'Admin':
              navigate('/admin-dashboard');
              break;
          case 'admin':
              navigate('/admin-dashboard');
              break;
          default:
            navigate('*');
            break;
        }
      }catch(error){
        console.error('Role error:', error.message);
      }
      // Authentication successful, navigate to the appropriate dashboard
      
    } catch (error) {
      console.error('Authentication error:', error.message);
      setEmailError('Invalid email or password');
      setPasswordError('Invalid email or password');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Navbar buttonState={'INQUIRE NOW'} buttonLoc={'/inquire'}/>
      <img
        src={LoginImage}
        alt="Background"
        className="absolute inset-0 w-full h-full z-0"
        style={{ objectFit: 'cover', objectPosition: 'center', zIndex: '-1', position: 'fixed' }}
      />
      <div className="flex justify-center items-center h-full mt-40">
        <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg border border-black relative w-96">
          <h2 className="text-3xl text-center mb-10 text-white font-bold">SIGN IN</h2>
          <div className="mb-6">
            <div className="relative"> 
              <HiOutlineUser className="absolute h-4 w-4 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:border-gray-500 bg-white "
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            {emailError && <p className="text-red-500">{emailError}</p>}
          </div>

          
          <div className="mb-6">
            <div className="relative">
              <HiOutlineLockClosed className="absolute h-4 w-4 text-gray-400 left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:border-gray-500 bg-white"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>

          <div className="mt-4">
            <button onClick={handleSubmit} className="bg-customYellow text-white py-2 px-4 rounded-full hover:bg-yellow-600 block w-full mt-10 font-bold">Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
