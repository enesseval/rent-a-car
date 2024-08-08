import React from "react";
import HashLoader from "react-spinners/HashLoader";

function Loading() {
   return (
      <div className="flex items-center justify-center w-full h-screen">
         <HashLoader color="#22d3ee" size={100} speedMultiplier={1.5} />
      </div>
   );
}

export default Loading;
