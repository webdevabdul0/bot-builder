import React from 'react';

const HelpBanner = () => {
  const openCalendly = () => {
    // Open Calendly in a popup window
    window.open(
      'https://calendly.com/helloflossly/add-my-chatbot',
      'calendly',
      'width=800,height=700,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <div className="mx-4 sm:mx-6 mt-4">
      {/* Outer wrapper with gradient border */}
      <div 
        className="p-1 rounded-2xl shadow-lg"
        style={{
          background: 'linear-gradient(90deg, #FFA977 0%, #FF85DA 32.21%, #7D77FF 63.94%, #68ECE6 100%)',
          padding: '4px',
        }}
      >
        {/* Inner content with gradient background */}
        <div 
          className="p-4 sm:p-5 flex items-center justify-between gap-4 rounded-xl"
          style={{
            background: 'linear-gradient(90deg, #263388 0%, #3247A4 50%, #AD7CF3 100%)',
          }}
        >
          {/* Left side - Text content */}
          <div className="flex-1 text-left">
            <h3 className="text-white text-base sm:text-lg font-semibold mb-1">
              Add my Bot
            </h3>
            <p className="text-white text-xs sm:text-sm opacity-90">
              Need help installing your Flossly chatbot? Our team will set it up for you, fast and hassle-free.
            </p>
          </div>

          {/* Right side - Button */}
          <button
            onClick={openCalendly}
            className="px-4 py-2 bg-white rounded-lg font-normal hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap text-sm"
            style={{
              color: 'hsla(247, 50%, 58%, 1)',
            }}
          >
            Request Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpBanner;
