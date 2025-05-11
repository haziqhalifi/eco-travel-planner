function CarbonCalculator() {
  return (
    <>
      <nav className="custom-navbar">
        <div className="nav-container">
          <h1 className="navbar-title">Carbon Footprint Tracker</h1>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <h2>Input Your Activity</h2>
          <div className="input-group">
            <label htmlFor="car">Daily car usage (km)</label>
            <input type="number" id="car" placeholder="e.g., 25" />
          </div>
          <div className="input-group">
            <label htmlFor="flight">Monthly flights (hours)</label>
            <input type="number" id="flight" placeholder="e.g., 3" />
          </div>
          <button className="btn">Calculate</button>
        </div>

        <div className="card">
          <h2>Your Estimated Carbon Footprint</h2>
          <p><strong>540 kg CO₂</strong> this month</p>
          <div className="progress-bar">
            <div className="progress" style={{ width: '54%' }}></div>
          </div>
        </div>
      </div>
    </>
  );
}
