import React from "react";
import { Bed, Map, Calculator, Cloud } from "lucide-react";
import Card from "../components/Card";
import CardImage from "../components/cardImage";
import pataya from "../assets/pataya.jpg";
import forest from "../assets/forest.jpg";

function Dashboard() {
  return (
    <div className="bg-white text-dark">
      {/* Hero Section */}
      <section
        className="text-center py-5"
        style={{
          backgroundImage: `url(${forest})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <div className="container py-5 bg-dark bg-opacity-50 rounded">
          <h1 className="display-5 fw-bold">Plan Your Sustainable Journey</h1>
          <p className="lead mb-4">
            Travel smart, travel green – Your eco-conscious adventure starts
            here
          </p>

          {/* Search Bar */}
          <div className="row justify-content-center g-2">
            <div className="col-10 col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Where do you want to go?"
              />
            </div>
            <div className="col-10 col-md-3">
              <input
                type="date"
                className="form-control"
                placeholder="When do you want to travel?"
              />
            </div>
            <div className="col-10 col-md-2">
              <button className="btn btn-success w-100">
                Search Eco Options
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container py-5">
        <div className="row text-center">
          <div className="col-md-3 mb-4">
            <Card
              title="Eco-Friendly Options"
              description="Discover sustainable accommodations and dining"
              icon={<Bed className="text-success" size={24} />}
              linkText="Explore"
            />
          </div>
          <div className="col-md-3 mb-4">
            <Card
              title="Green Itineraries"
              description="Create low-impact travel plans"
              icon={<Map className="text-success" size={24} />}
              linkText="Plan Now"
            />
          </div>
          <div className="col-md-3 mb-4">
            <Card
              title="Carbon Footprint"
              description="Calculate & offset your travel impact"
              icon={<Calculator className="text-success" size={24} />}
              linkText="Calculate"
            />
          </div>
          <div className="col-md-3 mb-4">
            <Card
              title="Weather Forecast"
              description="Check destination weather"
              icon={<Cloud className="text-success" size={24} />}
              linkText="View Weather"
            />
          </div>
        </div>
      </section>

      {/* Top Destinations */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="fw-semibold mb-4 text-center">Top Destinations</h2>
          <div className="d-flex gap-3 overflow-auto">
            {[...Array(4)].map((_, index) => (
              <CardImage
                key={index}
                title="Pataya"
                image={pataya}
                description="Explore our beach"
                linkText="View details"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Impact Calculator */}
      <section className="container py-5">
        <div className="row align-items-start">
          <div className="col-md-6 mb-4">
            <h3 className="fw-bold">Track Your Environmental Impact</h3>
            <p>
              Calculate your travel carbon footprint and discover ways to offset
              your environmental impact. Make informed choices for sustainable
              travel.
            </p>
            <button className="btn btn-success">Calculate Now</button>
          </div>
          <div className="col-md-6">
            <div className="card shadow-sm bg-light">
              <div className="card-body">
                <h5 className="fw-semibold mb-3">Quick Carbon Calculator</h5>
                <div className="mb-3">
                  <label className="form-label">Transportation Mode</label>
                  <select className="form-select">
                    <option>Train</option>
                    <option>Car</option>
                    <option>Bus</option>
                    <option>Flight</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Distance (km)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter distance"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Number of Travelers</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter number of travelers"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
