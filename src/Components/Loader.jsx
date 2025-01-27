import React from "react";

function Loader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
}

export default Loader;
