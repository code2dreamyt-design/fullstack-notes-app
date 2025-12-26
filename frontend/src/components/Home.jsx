import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
const Home = () => {
  const navigate = useNavigate();

  const checkMe = async () => {
    try {
      const response = await api.post('/login/checkme', {});


      
        navigate("/notes");
        console.log(response.data?.msg);
    
    } catch (error) {
      console.log(error.response.status);
      console.log(error.response?.data?.msg)
    }
  };

  useEffect(() => {
    checkMe();
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl flex flex-col items-center">

        {/* TITLE */}
        <div
          className="text-center font-bold text-lg sm:text-xl md:text-3xl
            text-white h-14 sm:h-16 w-full sm:w-[90%]
            rounded-4xl shadow-[0px_4px_30px_green]
            flex items-center justify-center mb-6"
        >
          Welcome To Notiq
        </div>

        {/* ACTION BUTTONS */}
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="text-center font-bold h-10 w-full sm:w-[45%]
              bg-[linear-gradient(159deg,rgba(14,105,29,1)_20%,rgba(69,212,47,1)_45%,rgba(26,71,5,1)_72%)]
              rounded-4xl shadow-[0px_4px_30px_black]
              flex items-center justify-center"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="text-center font-bold h-10 w-full sm:w-[45%]
              bg-[linear-gradient(159deg,rgba(14,105,29,1)_20%,rgba(69,212,47,1)_45%,rgba(26,71,5,1)_72%)]
              rounded-4xl shadow-[0px_4px_30px_black]
              flex items-center justify-center"
          >
            Sign up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;
