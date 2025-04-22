import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tripsData from "../data/tripsData.js";

const Trip = () => {
  const navigate = useNavigate();
  const [trips] = useState(tripsData);
  // const [trips, setTrips] = useState([
  //   {
  //     id: 1,
  //     title: "Switzerland Trip Rundown",
  //     startDate: "2024-08-21",
  //     endDate: "2024-08-29",
  //     location: "Switzerland",
  //     image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=1000",
  //     description: "Explore the beauty of the Swiss Alps and charming cities."
  //   },
  //   {
  //     id: 2,
  //     title: "Italy Adventure",
  //     startDate: "2024-09-15",
  //     endDate: "2024-09-25",
  //     location: "Italy",
  //     image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000",
  //     description: "Experience the rich history and cuisine of Italy."
  //   },
  //   {
  //     id: 3,
  //     title: "Japan Discovery",
  //     startDate: "2024-10-10",
  //     endDate: "2024-10-22",
  //     location: "Japan",
  //     image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1000",
  //     description: "Immerse yourself in the unique blend of tradition and modernity."
  //   }
  // ]);

  const handleTripSelect = (tripId) => {
    navigate(`/itinerary/${tripId}`);
  };

  // Calculate trip duration in days
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
      <Container fluid className="bg-light min-vh-100 py-4" style={{ color: '#1A472A', fontFamily: 'Montserrat, sans-serif' }}>
        <div className="text-center mb-5">
          <h1 className="fw-bold text-forest">My Travel Plans</h1>
          <p className="text-muted">Select a trip to view detailed itinerary</p>
        </div>

        <Row className="g-4">
          {trips.map((trip) => (
              <Col key={trip.id} md={6} lg={4}>
                <Card
                    className="h-100 shadow-sm border-0 trip-card"
                    style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
                    onClick={() => handleTripSelect(trip.id)}
                >
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <Card.Img
                        variant="top"
                        src={trip.image}
                        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <MapPin size={16} className="text-forest me-1" />
                      <span className="text-muted small">{trip.location}</span>
                      <Badge
                          bg="light"
                          text="dark"
                          className="ms-auto px-2 py-1"
                      >
                        {calculateDuration(trip.startDate, trip.endDate)} days
                      </Badge>
                    </div>

                    <Card.Title className="fw-bold mb-1 text-forest">{trip.title}</Card.Title>

                    <div className="text-muted small mb-2 d-flex align-items-center">
                      <Calendar size={14} className="me-1" />
                      <span>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </span>
                    </div>

                    <Card.Text className="text-forest small mb-3">
                      {trip.description}
                    </Card.Text>

                    <div className="mt-auto d-flex align-items-center text-forest">
                      <span className="fw-semibold small">View Itinerary</span>
                      <ArrowRight size={16} className="ms-1" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
          ))}
        </Row>

        <style jsx>{`
        .trip-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
        }
      `}</style>
      </Container>
  );
};

export default Trip;