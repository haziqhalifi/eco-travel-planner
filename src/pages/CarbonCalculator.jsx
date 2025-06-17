import React, { useState } from 'react';
import axios from 'axios';

function CarbonCalculator() {
  const [vehicleType, setVehicleType] = useState('');
  const [carUsage, setCarUsage] = useState('');
  const [electricityUsage, setElectricityUsage] = useState('');
  const [foodType, setFoodType] = useState('');
  const [shortFlight, setShortFlight] = useState('');
  const [mediumFlight, setMediumFlight] = useState('');
  const [longFlight, setLongFlight] = useState('');
  const [footprint, setFootprint] = useState(null);

  const styles = {
    card: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
    },
    inputGroup: {
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 'bold',
    },
    input: {
      width: '50%',
      padding: '0.5rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      height: '3rem'
    },
    select: {
      width: '50%',
      padding: '0.5rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
    },
    button: {
      backgroundColor: '#2e7d32',
      color: 'white',
      padding: '0.6rem 1.2rem',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    progressBar: {
      backgroundColor: '#e0e0e0',
      borderRadius: '10px',
      overflow: 'hidden',
      height: '25px',
      marginTop: '1rem',
    },
    progress: {
      height: '100%',
      backgroundColor: '#66bb6a',
      transition: 'width 0.5s ease',
      width: footprint ? `${Math.min((footprint / 1000) * 100, 100)}%` : '0%',
    }
  };

  const handleCalculate = async () => {
    let vehicleFactor = 0;
    switch (vehicleType) {
      case 'Diesel Car': vehicleFactor = 0.27; break;
      case 'Petrol Car': vehicleFactor = 0.24; break;
      case 'Electric Car': vehicleFactor = 0.10; break;
      case 'Bicycle':
      case 'Scooter':
      case 'None': vehicleFactor = 0; break;
      default: vehicleFactor = 0.2;
    }

    const foodFactors = { Vegetarian: 3, 'Non-Vegetarian': 7, Vegan: 2 };
    const flightFactors = { short: 80, medium: 90, long: 100 };

    const carEmissions = parseFloat(carUsage || 0) * vehicleFactor * 30;
    const electricityEmissions = parseFloat(electricityUsage || 0) * 0.233;
    const foodEmissions = (foodFactors[foodType] || 3) * 30;
    const flightEmissions =
      parseFloat(shortFlight || 0) * flightFactors.short +
      parseFloat(mediumFlight || 0) * flightFactors.medium +
      parseFloat(longFlight || 0) * flightFactors.long;

    const total = carEmissions + electricityEmissions + foodEmissions + flightEmissions;
    setFootprint(total.toFixed(0));

    try {
      await axios.post("http://localhost:5001/api/carbon/saveFootprint", {
        vehicleType,
        carUsage: parseFloat(carUsage || 0),
        electricityUsage: parseFloat(electricityUsage || 0),
        foodType,
        shortFlight: parseFloat(shortFlight || 0),
        mediumFlight: parseFloat(mediumFlight || 0),
        longFlight: parseFloat(longFlight || 0),
        totalEmission: parseFloat(total.toFixed(0)),
      });

      alert("Footprint saved to backend!");
    } catch (error) {
      console.error("Error saving footprint:", error);
      alert("Failed to save footprint.");
    }
  };

  return (
    <div
      className="min-vh-100 py-8"
      style={{
        background: "linear-gradient(135deg, #e0f7fa 0%, #fffde4 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto my-8">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h1 className="mb-4 text-center">Carbon Footprint Calculator</h1>

          <div style={styles.card}>
            <h2>Input Your Activity</h2>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Type of Vehicle</label>
              <select style={styles.select} value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                <option value="">Select vehicle type</option>
                <option value="None">None</option>
                <option value="Diesel Car">Diesel Car</option>
                <option value="Petrol Car">Petrol Car</option>
                <option value="Electric Car">Electric Car</option>
                <option value="Bicycle">Bicycle</option>
                <option value="Scooter">Scooter</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Daily car usage (km)</label>
              <input style={styles.input} type="number" value={carUsage} onChange={(e) => setCarUsage(e.target.value)} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Electricity usage (kWh/month)</label>
              <input style={styles.input} type="number" value={electricityUsage} onChange={(e) => setElectricityUsage(e.target.value)} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Diet Type</label>
              <select style={styles.select} value={foodType} onChange={(e) => setFoodType(e.target.value)}>
                <option value="">Select Diet</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Short Flights (1–3 hrs/month)</label>
              <input style={styles.input} type="number" value={shortFlight} onChange={(e) => setShortFlight(e.target.value)} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Medium Flights (3–6 hrs/month)</label>
              <input style={styles.input} type="number" value={mediumFlight} onChange={(e) => setMediumFlight(e.target.value)} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Long Flights (6+ hrs/month)</label>
              <input style={styles.input} type="number" value={longFlight} onChange={(e) => setLongFlight(e.target.value)} />
            </div>

            <button style={styles.button} onClick={handleCalculate}>
              Calculate
            </button>
          </div>

          {footprint && (
            <div style={styles.card}>
              <h2>Your Estimated Carbon Footprint</h2>
              <p><strong>{footprint} kg CO₂</strong> this month</p>
              <div style={styles.progressBar}>
                <div style={styles.progress}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CarbonCalculator;
