import React from 'react';

function CarbonCalculator() {
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
      width: '100%',
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
      width: '54%',
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

          {/* Inserted calculator content */}
          <div style={styles.card}>
            <h2>Input Your Activity</h2>
            <div style={styles.inputGroup}>
              <label htmlFor="car" style={styles.label}>Daily car usage (km)</label>
              <input type="number" id="car" placeholder="e.g., 25" style={styles.input} />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="flight" style={styles.label}>Monthly flights (hours)</label>
              <input type="number" id="flight" placeholder="e.g., 3" style={styles.input} />
            </div>
            <button style={styles.button}>Calculate</button>
          </div>

          <div style={styles.card}>
            <h2>Your Estimated Carbon Footprint</h2>
            <p><strong>540 kg CO₂</strong> this month</p>
            <div style={styles.progressBar}>
              <div style={styles.progress}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarbonCalculator;
