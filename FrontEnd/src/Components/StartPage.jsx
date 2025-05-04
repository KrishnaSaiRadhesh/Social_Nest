import React from 'react';
import { Link } from 'react-router-dom';

const StartPage = () => {
  return (
  <div>
      <div className=" bg-gradient-to-b from-blue-100 w-[100vw] min-h-screen to-white overflow-hidden flex items-center justify-center gap-30">

      <div>
        <img src="../public/start.png" className='h-[25em]' alt="Logo" />
      </div>

      {/* Main Content */}
      <div className="text-center z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Join us today</h2>
        <p className="text-gray-500 mb-8 text-base md:text-lg">Enter your details to proceed further</p>

        {/* Pagination Dots */}
        <div className="flex justify-center mb-10">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-gray-300 rounded-full mx-1"></div>
          <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-600 rounded-full mx-1"></div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-6 w-80 md:w-[450px]">
            <button className="bg-white text-blue-600 py-3 rounded-full text-lg md:text-xl font-semibold hover:bg-blue-700 transition w-full">
              Get Started
            </button>
      

            <button className="bg-white text-blue-600 py-3 rounded-full text-lg md:text-xl font-semibold border border-blue-600 hover:bg-blue-50 transition w-full">
              Sign in
            </button>
        
        </div>
      </div>
    </div>
  </div>
  );
};

export default StartPage;