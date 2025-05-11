import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  InputGroup,
  Form,
  Button,
  Dropdown,
} from "react-bootstrap";
import { Calendar, MapPin, ArrowRight, Search, X, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tripsData from "../data/tripsData.js";

const Trip = () => {
  const navigate = useNavigate();
  const [trips] = useState(tripsData);
  const handleTripSelect = (tripId) => {
    navigate(`/itinerary/${tripId}`);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [filteredTrips, setFilteredTrips] = useState(trips);

  const allTags = [
    "hiking",
    "cycling",
    "wildlife",
    "sustainable-dining",
    "cultural",
    "kayaking",
  ];
  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "low", label: "$" },
    { value: "medium", label: "$$" },
    { value: "high", label: "$$$" },
  ];

  useEffect(() => {
    const results = trips.filter((trip) => {
      const matchesSearch =
        trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => trip.tags.includes(tag));

      const matchesPrice =
        priceRange === "all" || trip.budgetRange === priceRange;

      return matchesSearch && matchesTags && matchesPrice;
    });
    setFilteredTrips(results);
  }, [searchTerm, selectedTags, priceRange, trips]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setPriceRange("all");
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
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-light min-vh-100 py-8">
      <div className="container mx-auto my-8">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <div className="text-center mb-5">
            <h1 className="mb-4 text-center">My Travel Plans</h1>
            <p className="text-muted">
              Select a trip to view detailed itinerary
            </p>
          </div>

          {/*search input & filters*/}
          <div>
            <Row>
              {/*  search input*/}
              <Col className="mb-3">
                <InputGroup>
                  <InputGroup.Text>
                    <Search />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search trips or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => setSearchTerm("")}
                    >
                      <X />
                    </Button>
                  )}
                </InputGroup>
              </Col>

              {/*  Price filter*/}
              <Col md={3}>
                <Form.Select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              {/*tags dropdown*/}
              <Col md={3}>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-forest" id="tags-dropdown">
                    <Filter className="me-1" />
                    {selectedTags.length > 0
                      ? `${selectedTags.length} selected`
                      : "Filter by Tags"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="p-3">
                    <div className="d-flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <Badge
                          key={tag}
                          bg={selectedTags.includes(tag) ? "forest" : "light"}
                          text={selectedTags.includes(tag) ? "white" : "dark"}
                          onClick={() => handleTagToggle(tag)}
                          style={{ cursor: "pointer" }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {selectedTags.length > 0 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-2 p-0 text-danger"
                        onClick={clearFilters}
                      >
                        Clear all filters
                      </Button>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>

            {/* Active filters indicator */}
            {(searchTerm ||
              selectedTags.length > 0 ||
              priceRange !== "all") && (
              <div className=" mb-3">
                <small className="text-muted me-2">Active filters:</small>
                {searchTerm && (
                  <Badge bg="light" text="dark" className="me-2">
                    Search: "{searchTerm}"{" "}
                    <X
                      size={12}
                      onClick={() => setSearchTerm("")}
                      style={{ cursor: "pointer" }}
                    />
                  </Badge>
                )}
                {selectedTags.map((tag) => (
                  <Badge key={tag} bg="forest" className="me-2">
                    {tag}{" "}
                    <X
                      size={12}
                      onClick={() => handleTagToggle(tag)}
                      style={{ cursor: "pointer" }}
                    />
                  </Badge>
                ))}
                {priceRange !== "all" && (
                  <Badge bg="light" text="dark">
                    Price:{" "}
                    {priceRanges.find((r) => r.value === priceRange)?.label}
                    <X
                      size={12}
                      onClick={() => setPriceRange("all")}
                      style={{ cursor: "pointer" }}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/*trip card*/}
          {filteredTrips.length > 0 ? (
            <Row className="g-4 ">
              {filteredTrips.map((trip) => (
                <Col key={trip.id} md={6} lg={4}>
                  <Card
                    className="h-100 shadow-sm border-0 trip-card"
                    style={{ cursor: "pointer", transition: "transform 0.3s" }}
                    onClick={() => handleTripSelect(trip.id)}
                  >
                    <div style={{ height: "200px", overflow: "hidden" }}>
                      <Card.Img
                        variant="top"
                        src={trip.image}
                        style={{
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                        }}
                      />
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center mb-2">
                        <MapPin size={16} className="text-forest me-1" />
                        <span className="text-muted small">
                          {trip.location}
                        </span>
                        <Badge
                          bg="light"
                          text="dark"
                          className="ms-auto px-2 py-1"
                        >
                          {calculateDuration(trip.startDate, trip.endDate)} days
                        </Badge>
                      </div>

                      <Card.Title className="fw-bold mb-1 text-forest">
                        {trip.title}
                      </Card.Title>

                      <div className="text-muted small mb-2 d-flex align-items-center">
                        <Calendar size={14} className="me-1" />
                        <span>
                          {formatDate(trip.startDate)} -{" "}
                          {formatDate(trip.endDate)}
                        </span>
                      </div>

                      <Card.Text className="text-forest small mb-3">
                        {trip.description}
                      </Card.Text>

                      {/* Tags */}
                      <div className="mb-3">
                        {trip.tags.map((tag) => (
                          <Badge
                            key={tag}
                            bg="light"
                            text="dark"
                            className="me-1 mb-1"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Price Indicator */}
                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <span
                          className={`fw-semibold small ${
                            trip.budgetRange === "low"
                              ? "text-success"
                              : trip.budgetRange === "high"
                              ? "text-warning"
                              : "text-forest"
                          }`}
                        >
                          {trip.budgetRange === "low"
                            ? "$"
                            : trip.budgetRange === "medium"
                            ? "$$"
                            : "$$$"}
                        </span>
                        <div className="d-flex align-items-center text-forest">
                          <span className="fw-semibold small">
                            View Itinerary
                          </span>
                          <ArrowRight size={16} className="ms-1" />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="text-center py-5">
              <h4 className="text-muted">No trips match your filters</h4>
              <Button variant="outline-forest" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .trip-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
        .bg-forest {
          background-color: #1a472a;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .btn-outline-forest {
          color: #1a472a;
          border-color: #1a472a;
        }
        .btn-outline-forest:hover {
          background-color: #1a472a;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Trip;
