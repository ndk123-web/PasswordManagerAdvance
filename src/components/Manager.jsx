// Manager.jsx
// This component renders a background gradient for the application.

import React from "react";

const Manager = () => {
  return (
   <div className="absolute top-0 z-[-2] h-screen w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>
  );
};

export default Manager;
