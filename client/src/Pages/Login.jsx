import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText } from '@mui/material';
import { HiOutlineLockClosed, HiOutlineUser, HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi';
import LoginImage from '../Assets/LoginImage.png';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import instance from '../api'; // Import the Axios instance for API requests
import Swal from 'sweetalert2';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserdata] = useState({});
  const navigate = useNavigate();
  const [isOpen, setisOpen] = useState(false);
  const [userID, setuserID] = useState(null);
  const [step, setStep] = useState(1);
  const [emailreset, setemailreset] = useState('');
  const [emailresetError, setemailresetError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false); // State for toggling new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState({ code: '', expiration: 0 });
  const [enterotp, setenterOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Function to validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle opening the password reset modal
  const handleClick = () => {
    setStep(1);
    setisOpen(true);
  };

  // Handle changes in email input field
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Handle changes in password input field
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  // Handle form submission for login
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
        body: JSON.stringify({ email, password }),
      });
      console.log("ok");
      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const { token } = await response.json();
      console.log(token);
      localStorage.setItem('access_token', token);

      try {
        const resRole = await instance.get('/auth/current-user');
        // console.log(resRole.data);
        setUserdata(resRole.data);
        localStorage.setItem('role', resRole.data?.user?.role)
        // const role = userData?.user?.role;
        console.log(resRole.data?.user?.role);
        switch (resRole.data?.user?.role) {
          case 'Customer':
            navigate('/Customer/current-trip');
            break;
          case 'Guide':
            navigate('/guide-dashboard');
            break;
          case 'Staff':
            navigate('/staff-dashboard');
            break;
          case 'Admin':
            navigate('/admin-dashboard');
            break;
          default:
            navigate('*');
            break;
        }
      } catch (error) {
        console.error('Role error:', error.message);
      }
      // Authentication successful, navigate to the appropriate dashboard

    } catch (error) {
      console.error('Authentication error:', error.message);
      setEmailError('Invalid email or password');
      setPasswordError('Invalid email or password');
    }
  };

  // Handle closing the password reset modal
  const handleClose = () => {
    setisOpen(false);
    setemailreset('');
    setNewPassword('');
    setemailresetError('');
    setConfirmPassword('');
    setOtp({ code: '', expiration: 0 });
    setOtpSent(false);
    setenterOtp('');
  };

  // Handle the next step in the password reset process
  const handleNext = async () => {
    if (emailreset) {
      if (validateemailreset(emailreset)) {
        try {
          const response = await fetch('http://localhost:3001/auth/search', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailreset }),
          });

          if (response.ok) {
            // User added successfully
            const data = await response.json();
            const userdata = data.user[0];
            setuserID(userdata.UserID);
            setStep(2);
          }

        } catch (error) {
          // Handle network or unexpected errors
          console.error('Error searching User:', error);
          let errorMessage = 'An error occurred while searching the User.';
          Swal.fire({
            icon: 'error',
            title: 'User Not Exists',
            text: errorMessage,
            customClass: {
              popup: 'z-50', // Apply Tailwind CSS class to adjust z-index
            },
            didOpen: () => {
              document.querySelector('.swal2-container').style.zIndex = '9999'; // Adjust z-index here
            }
          });
        }
      }
    } else if (emailreset === '') {
      setemailresetError('This field is required.');
    }
  };

  // Generate OTP for password reset
  const generateOTP = () => {
    const otpcode = Math.floor(100000 + Math.random() * 900000).toString();

    // Get the current timestamp
    const timestamp = Date.now();

    const expiration = timestamp + 60 * 1000 * 5;//otp expired in 5 minutes


    return { code: otpcode, expiration: expiration }; // Return the generated OTP
  };

  // Handle sending OTP for password reset
  const handleSendOtp = async () => {

    let newPasswordError = '';
    let confirmPasswordError = '';

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      confirmPasswordError = 'Passwords do not match';
    }

    // Check if newPassword meets your criteria, e.g., minimum length
    if (newPassword.length < 8 || newPassword.length > 15) {
      newPasswordError = 'Password must be between 8 and 15 characters';
    }

    // If there are errors, update the state to display them
    if (newPasswordError || confirmPasswordError) {
      setNewPasswordError(newPasswordError);
      setConfirmPasswordError(confirmPasswordError);
      return; // Don't proceed further if there are errors
    }

    try {
      const generatedOtp = generateOTP(); // Generate OTP and get its value
      setOtp(generatedOtp);

      const response = await fetch('http://localhost:3001/auth/sendotp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: emailreset, genotp: generatedOtp.code }),
      });

      if (response.ok) {
        // OTP sent successfully, set otpSent state to true
        setOtpSent(true);
      } else {
        // Handle error if OTP sending fails
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      let errorMessage = 'An error occurred while searching the User.';
      Swal.fire({
        icon: 'error',
        title: 'Error sending OTP',
        text: errorMessage,
        customClass: {
          popup: 'z-50', // Apply Tailwind CSS class to adjust z-index
        },
        didOpen: () => {
          document.querySelector('.swal2-container').style.zIndex = '9999'; // Adjust z-index here
        }
      });
    }

  };

  // Handle password reset process
  const handleReset = async() => {
    if (otp.code && enterotp) {
      // Check if entered OTP matches the saved OTP
      if (otp.code === enterotp) {
        // Check if OTP has not expired
        const currentTimestamp = Date.now();
        if (otp.expiration > currentTimestamp) {
          try {
            const response = await fetch(`http://localhost:3001/auth/resetpass/${userID}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ newPassword }), // Pass newPassword as an object property
            })

            if (response.ok) {

              const data = await response.json();
              console.log(data);
              const userId = data.UserId;

              console.log('Password reset successfully for user ID:', userId);
              // Show success message using SweetAlert with user ID
              Swal.fire({
                icon: 'success',
                title: 'Password Reset Successful',
                text: `Password reset successfully for user ID: ${userId}`,
                customClass: {
                  popup: 'z-50', // Apply Tailwind CSS class to adjust z-index
                },
                didOpen: () => {
                  document.querySelector('.swal2-container').style.zIndex = '9999'; // Adjust z-index here
                },
              }).then(() => {
                handleClose();
              });
            } else if (response.status === 400) {
              Swal.fire({
                icon: 'error',
                title: 'Password Reset Failed',
                text: 'New password cannot be the same as the current password.',
                customClass: {
                  popup: 'z-50', // Apply Tailwind CSS class to adjust z-index
                },
                didOpen: () => {
                  document.querySelector('.swal2-container').style.zIndex = '9999'; // Adjust z-index here
                }
              });

            } else if (response.status === 500) {
              Swal.fire({
                icon: 'error',
                title: 'Password Reset Failed',
                didOpen: () => {
                  document.querySelector('.swal2-container').style.zIndex = '9999'; // Adjust z-index here
                }
              });

            }
          } catch (error) {
            console.error('Error resetting password:', error);
            let errorMessage = 'An error occurred while resetting your password. Please try again later.';

            // Customize error message based on specific scenarios
            if (error.message === 'New password cannot be the same as the current password') {
              errorMessage = 'New password cannot be the same as the current password';
            }

            // Show error message using SweetAlert
            Swal.fire({
              icon: 'error',
              title: 'Password Reset Failed',
              text: errorMessage,
            });
          }
          return;

        } else {
          // OTP has expired
          Swal.fire({
            icon: 'error',
            title: 'OTP Expired',
            text: 'The OTP has expired. Please try again.',
            customClass: {
              popup: 'z-50', // Apply Tailwind CSS class to adjust z-index
            },
            didOpen: () => {
              document.querySelector('.swal2-container').style.zIndex = '9999'; // Adjust z-index here
            }
          }).then(() => {
            handleClose();
          });
          return;
        }
      } else {
        // Entered OTP does not match the saved OTP
        Swal.fire({
          icon: 'error',
          title: 'Incorrect OTP',
          text: 'The entered OTP is incorrect. Please try again.',
          customClass: {
            popup: 'z-50', // Apply Tailwind CSS class to adjust z-index
          },
          didOpen: () => {
            document.querySelector('.swal2-container').style.zIndex = '9999'; // Adjust z-index here
          }
        })
        return;
      }
    } else {
      // OTP or entered OTP is not available
      Swal.fire({
        icon: 'error',
        title: 'Missing OTP',
        text: 'The OTP is missing or invalid. Please try again.',
        customClass: {
          popup: 'z-50', // Apply Tailwind CSS class to adjust z-index
        },
        didOpen: () => {
          document.querySelector('.swal2-container').style.zIndex = '9999'; // Adjust z-index here
        }
      });
      return;
    }
  };

  // Validate email reset field
  const validateemailreset = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(value)) {
      setemailresetError('');
      return true;
    } else {
      setemailresetError('Please enter a valid email.');
      return false;
    }
  };

  // Handle changes in email reset input field
  const handleemailresetChange = (e) => {
    const value = e.target.value;
    setemailreset(value);
    setemailresetError('');
  };

  return (
    <div style={{ position: 'relative' }}>
      <Navbar buttonState={'INQUIRE NOW'} buttonLoc={'/inquire'} />
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:border-gray-500 bg-white"
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                className="absolute inset-y-0 right-0 px-3 flex items-center pointer-events-auto"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility on button click
              >
                {showPassword ? (
                  <HiOutlineEyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <HiOutlineEye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            {passwordError && <p className="text-red-500">{passwordError}</p>}
          </div>

          <div className='flex justify-end font-light text-[14px] mb-4 text-white' onClick={handleClick}>
            <p className="cursor-pointer"><u>Forgot Password?</u></p>
          </div>

          <div className="mt-4">
            <button onClick={handleSubmit} className="bg-customYellow text-white py-2 px-4 rounded-full hover:bg-yellow-600 block w-full mt-10 font-bold">Login</button>
          </div>
        </div>
        <Dialog
        open={isOpen}
        aria-labelledby="form-dialog-title"
        disableEscapeKeyDown={true}
        BackdropProps={{
          style: { backdropFilter: 'blur(5px)' },
          invisible: true // This will prevent backdrop click
        }}
      >
        <DialogTitle id="form-dialog-title" className='text-center' style={{ fontSize: '24px' }}><b>Reset password</b></DialogTitle>
        <div className='mb-3'>
          <DialogContent>
            {step === 1 ? (
              <>
                <DialogContentText>
                  Please enter your email to reset your password.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="emailreset"
                  label="Email"
                  type="text"
                  fullWidth
                  value={emailreset}
                  onChange={handleemailresetChange}
                  error={Boolean(emailresetError)}
                  helperText={emailresetError}
                  className="mb-4"
                  autoComplete='off'
                />
                <DialogActions>
                  <Button onClick={handleClose} color="error" variant="contained" className='w-[18%]'>
                    Cancel
                  </Button>
                  <Button onClick={handleNext} color="success" variant="contained" className='w-[18%]' style={{ backgroundColor: '#122f4b' }}>
                    Next
                  </Button>
                </DialogActions>
              </>
            ) : step === 2 ? (
              <>
                <DialogContentText>
                  Please enter your new password.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'} // Toggle password visibility based on showNewPassword state
                  fullWidth
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    // Hide helper text if the input field is touched
                    if (e.target.value.length > 0) {
                      setNewPasswordError('');
                    }
                  }}
                  error={!!newPasswordError}
                  helperText={newPasswordError}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                  disabled={otpSent}
                />
                <TextField
                  margin="dense"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'} // Toggle password visibility based on showConfirmPassword state
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    // Hide helper text if the input field is touched
                    if (e.target.value.length > 0) {
                      setConfirmPasswordError('');
                    }
                  }}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                  disabled={otpSent}
                />
                {otpSent && (
                  <>
                    <TextField
                      margin="dense"
                      id="otp"
                      label="OTP"
                      type="text"
                      fullWidth
                      value={enterotp}
                      onChange={(e) => {
                        const enteredValue = e.target.value;
                        // Only allow numbers and limit input to 6 digits
                        const sanitizedValue = enteredValue.replace(/\D/g, '').slice(0, 6);
                        setenterOtp(sanitizedValue);
                      }}
                      inputProps={{
                        inputMode: 'numeric', // Only allow numeric input
                        pattern: '[0-9]*', // Restrict input to numbers only
                        maxLength: 6, // Limit input to 6 characters
                      }}
                      className="mb-4"
                    />
                    <DialogContentText style={{ color: '#00a32c' }}>OTP sent successfully</DialogContentText>
                  </>
                )}
                <DialogActions>
                  <Button onClick={handleClose} color="error" variant="contained" >
                    Cancel
                  </Button>
                  {!otpSent ? (
                    <Button onClick={handleSendOtp} color="success" variant="contained" style={{ backgroundColor: '#122f4b' }}>
                      Send OTP
                    </Button>
                  ) : (
                    <Button onClick={handleReset} color="success" variant="contained">
                      Reset Password
                    </Button>
                  )
                  }
                </DialogActions>
              </>
            ) : null}
          </DialogContent>
        </div>
      </Dialog>
      </div>
    </div>
  );
};

export default Login;
