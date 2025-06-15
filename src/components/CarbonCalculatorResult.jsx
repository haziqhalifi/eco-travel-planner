import React from 'react';

const CarbonCalculatorResult = ({ footprint }) => {
  const percentage = Math.min((footprint / 2000) * 100, 100);

  return (
    <div className="alert alert-success mt-4">
      <h4>Your Estimated Carbon Footprint</h4>
      <p><strong>{footprint} kg CO₂</strong> this month</p>
      <div className="progress mt-3">
        <div className="progress-bar bg-success" role="progressbar" style={{ width: `${percentage}%` }} aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100" />
      </div>
    </div>
  );
};

export default CarbonCalculatorResult;
