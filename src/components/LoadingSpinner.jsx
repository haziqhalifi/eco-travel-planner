import React from 'react';

const LoadingSpinner = () => {
   return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
         <div className="text-center">
            <div className="spinner-border text-success" role="status" style={{ width: "3rem", height: "3rem" }}>
               <span className="visually-hidden">Loading...</span>
            </div>
            <div className="mt-3">
               <p className="text-muted">Loading...</p>
            </div>
         </div>
      </div>
   );
};

export default LoadingSpinner; 