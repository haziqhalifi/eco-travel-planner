import React from "react";
import { Bed, Map, Calculator, Cloud } from "lucide-react";
import Card from "../components/card";
import CardImage from "../components/cardImage";
import pataya from "../assets/pataya.jpg";
import forest from "../assets/forest.jpg"; // Background image

function Dashboard() {
  return (
    <div
      className="position-relative min-vh-100 w-100 overflow-hidden bg-white"
      style={{
        backgroundImage: `url(${forest})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay Section */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex flex-column align-items-center text-center px-3 z-1 overflow-auto">
        <div className="container py-5">
          <h1 className="text-white display-4 fw-bold mb-4">
            Plan Your Sustainable Journey
          </h1>
          <p className="text-white fs-5 mx-auto" style={{ maxWidth: "720px" }}>
            Discover eco-friendly travel options and reduce your carbon
            footprint with our personalized itinerary planner.
          </p>

          {/* Main Features */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 py-4">
            <div className="col">
              <Card
                title="Eco-Friendly Options"
                description="Discover sustainable accommodations and dining"
                icon={<Bed className="text-success" size={24} />}
                linkText="Explore"
              />
            </div>
            <div className="col">
              <Card
                title="Green Itineraries"
                description="Create low-impact travel plans"
                icon={<Map className="text-success" size={24} />}
                linkText="Plan Now"
              />
            </div>
            <div className="col">
              <Card
                title="Carbon Footprint"
                description="Calculate & offset your travel impact"
                icon={<Calculator className="text-success" size={24} />}
                linkText="Calculate"
              />
            </div>
            <div className="col">
              <Card
                title="Weather Forecast"
                description="Check destination weather"
                icon={<Cloud className="text-success" size={24} />}
                linkText="View Weather"
              />
            </div>
          </div>

          {/* Top Destinations */}
          <section>
            <h2 className="text-white fs-3 fw-semibold mt-5">
              Top Destinations
            </h2>
            <div
              className="d-flex flex-nowrap gap-3 py-4"
              style={{ overflowX: "hidden" }}
            >
              <CardImage
                title="Pataya"
                image={pataya}
                description="Explore our beach"
                linkText="View details"
              />
              <CardImage
                title="Pataya"
                image={pataya}
                description="Explore our beach"
                linkText="View details"
              />
              <CardImage
                title="Pataya"
                image={pataya}
                description="Explore our beach"
                linkText="View details"
              />
              <CardImage
                title="Pataya"
                image={pataya}
                description="Explore our beach"
                linkText="View details"
              />
            </div>
          </section>

          <section className="text-white text-center mt-5">
            <h2 className="fs-4">Track Your Environmental Effect</h2>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
