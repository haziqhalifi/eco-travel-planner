import React, { useState } from 'react';

function CarbonCalculator() {
  const [vehicleType, setVehicleType] = useState('');
  const [carUsage, setCarUsage] = useState('');
  const [flightHours, setFlightHours] = useState('');
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
      height: '5rem'
      
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

  const handleCalculate = () => {
    let vehicleFactor = 0;
    switch (vehicleType) {
      case 'Diesel Car': vehicleFactor = 0.27; break;
      case 'Petrol Car': vehicleFactor = 0.24; break;
      case 'Electric Car': vehicleFactor = 0.10; break;
      case 'Bicycle':
      case 'Scooter':
      case 'None': vehicleFactor = 0; break;
      case 'Other': vehicleFactor = 0.20; break;
      default: vehicleFactor = 0;
    }

    const carEmissions = parseFloat(carUsage || 0) * vehicleFactor * 30; // assuming daily usage * 30 days
    const flightEmissions = parseFloat(flightHours || 0) * 90; // approx. 90 kg CO2 per flight hour
    const total = carEmissions + flightEmissions;

    setFootprint(total.toFixed(0));
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
              <label htmlFor="vehicleType" style={styles.label}>Type of Vehicle</label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={styles.select}
              >
                <option value="">Select vehicle type</option>
                <option value="None">None</option>
                <option value="Diesel Car">Diesel Car</option>
                <option value="Petrol Car">Petrol Car</option>
                <option value="Electric Car">Electric Car</option>
                <option value="Bicycle">Bicycle</option>
                <option value="Electric Scooter">Scooter</option>
                <option value="Diesel Motorcyle">Other</option>
                <option value="Petrol Motorcyle">Other</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="car" style={styles.label}>Daily car usage (km)</label>
              <input
                type="number"
                id="car"
                placeholder="e.g., 25"
                value={carUsage}
                onChange={(e) => setCarUsage(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="flight" style={styles.label}>Monthly flights (hours)</label>
              <input
                type="number"
                id="flight"
                placeholder="e.g., 3"
                value={flightHours}
                onChange={(e) => setFlightHours(e.target.value)}
                style={styles.input}
              />
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
