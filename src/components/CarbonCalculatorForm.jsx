import React from 'react';

const CarbonCalculatorForm = ({ inputs, setInputs, handleCalculate }) => {
  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  return (
    <form className="row g-4">
      <div className="col-12">
        <label className="form-label">Vehicle Type</label>
        <select className="form-select" name="vehicleType" value={inputs.vehicleType} onChange={handleChange}>
          <option value="">Select vehicle type</option>
          <option value="None">None</option>
          <option value="Diesel Car">Diesel Car</option>
          <option value="Petrol Car">Petrol Car</option>
          <option value="Electric Car">Electric Car</option>
          <option value="Bicycle">Bicycle</option>
          <option value="Scooter">Scooter</option>
        </select>
      </div>

      <div className="col-12">
        <label className="form-label">Daily Car Usage (km)</label>
        <input type="number" className="form-control" name="carUsage" value={inputs.carUsage} onChange={handleChange} />
      </div>

      <div className="col-12">
        <label className="form-label">Monthly Electricity Usage (kWh)</label>
        <input type="number" className="form-control" name="electricityUsage" value={inputs.electricityUsage} onChange={handleChange} />
      </div>

      <div className="col-12">
        <label className="form-label">Food Type</label>
        <select className="form-select" name="foodType" value={inputs.foodType} onChange={handleChange}>
          <option value="">Select food type</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
        </select>
      </div>

      <div className="col-12">
        <label className="form-label">Short Haul Flights (≤3 hrs/month)</label>
        <input type="number" className="form-control" name="shortFlights" value={inputs.shortFlights} onChange={handleChange} />
      </div>

      <div className="col-12">
        <label className="form-label">Medium Haul Flights (3–6 hrs/month)</label>
        <input type="number" className="form-control" name="mediumFlights" value={inputs.mediumFlights} onChange={handleChange} />
      </div>

      <div className="col-12">
        <label className="form-label">Long Haul Flights (≥6 hrs/month)</label>
        <input type="number" className="form-control" name="longFlights" value={inputs.longFlights} onChange={handleChange} />
      </div>

      <div className="col-12 d-grid mt-3">
        <button type="button" className="btn btn-success" onClick={handleCalculate}>
          Calculate
        </button>
      </div>
    </form>
  );
};

export default CarbonCalculatorForm;
