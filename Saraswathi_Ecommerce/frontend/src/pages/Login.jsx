// src/pages/Login.jsx
import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import myImage from "../components/images/login.png";

const Login = () => {
  const [currentState, setCurrentState] = useState('Login'); // Login | Sign Up | Mobile
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // now used for email OR mobile
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } else toast.error(response.data.message);
      } 
      else if (currentState === 'Login') {
        let loginData;
        // Check if input is 10-digit mobile
        if (/^\d{10}$/.test(email)) {
          // ✅ Send mobile as-is (backend will normalize to 10-digit)
          loginData = { mobile: email, password };
        } else {
          loginData = { email, password };
        }

        const response = await axios.post(`${backendUrl}/api/user/login`, loginData);
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          navigate('/');
        } else {
          // ✅ Better error handling
          const msg = response.data.message;
          if (msg.includes("password") || msg.includes("OTP")) {
            toast.error("No password set. Use 'Login with Mobile Number (OTP)' below.");
          } else {
            toast.error(msg);
          }
        }
      }
      else if (currentState === 'Mobile') {
        if (!/^\d{10}$/.test(mobile)) {
          toast.error('Please enter a valid 10-digit mobile number');
          return;
        }

        const fullMobile = '+91' + mobile;

        if (!otpSent) {
          const response = await axios.post(`${backendUrl}/api/otp/send-otp`, { mobile: fullMobile });
          if (response.data.success) {
            toast.success('OTP sent successfully!');
            setOtpSent(true);
          } else {
            toast.error(response.data.message || 'Failed to send OTP');
          }
        } else {
          const response = await axios.post(`${backendUrl}/api/otp/verify-otp`, { 
            mobile: fullMobile, 
            otp 
          });
          if (response.data.success) {
            toast.success('Login successful!');
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            navigate('/');
          } else {
            toast.error(response.data.message || 'Invalid OTP');
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const switchToState = (newState) => {
    setCurrentState(newState);
    if (newState !== 'Mobile') {
      setMobile('');
      setOtp('');
      setOtpSent(false);
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <div className="hidden lg:block w-1/2 bg-gray-900 relative">
        <img src={myImage} alt="Hero" className="w-full h-full object-cover" />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-12">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-bold mb-1">
            {currentState === 'Login'
              ? 'Sign in to Celebration'
              : currentState === 'Sign Up'
              ? 'Create your account'
              : 'Login with Mobile'}
          </h2>

          <p className="text-sm text-gray-600 mb-6">
            {currentState === 'Login'
              ? "Don't have an account? "
              : currentState === 'Sign Up'
              ? "Already have an account? "
              : "Use email instead? "}
            <button
              onClick={() =>
                switchToState(
                  currentState === 'Login' ? 'Sign Up' :
                  currentState === 'Sign Up' ? 'Login' :
                  'Login'
                )
              }
              className="text-blue-600 hover:underline font-medium"
            >
              {currentState === 'Login'
                ? 'Create a free account'
                : currentState === 'Sign Up'
                ? 'Login Here'
                : 'Login with Email'}
            </button>
          </p>

          {currentState !== 'Mobile' && (
            <button
              onClick={() => switchToState('Mobile')}
              className="text-sm text-blue-600 underline mb-4"
            >
              Or login with Mobile Number (OTP)
            </button>
          )}

          <form onSubmit={onSubmitHandler} className="space-y-4">
            {currentState === 'Sign Up' && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            )}

            {currentState === 'Mobile' ? (
              <>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  required
                  maxLength={10}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {otpSent && (
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                )}
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Mobile (10 digits)"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-medium transition ${
                currentState === 'Mobile'
                  ? 'bg-green-600 text-white'
                  : currentState === 'Login'
                  ? 'bg-blue-600 text-white'
                  : 'bg-black text-white'
              }`}
            >
              {currentState === 'Sign Up'
                ? 'Sign Up'
                : currentState === 'Login'
                ? 'Login'
                : otpSent
                ? 'Verify OTP'
                : 'Send OTP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;