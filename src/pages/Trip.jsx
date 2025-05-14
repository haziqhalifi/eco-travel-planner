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
import { Calendar, MapPin, ArrowRight, Search, X, Filter, PlusCircle, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tripsData from "../data/tripsData.js";
import PersonalItinerary from "../components/PersonalItinerary.jsx";
import TripCard from "../components/TripCard.jsx";
import TripList from "../components/TripList.jsx";

const Trip = () => {
  const navigate = useNavigate();
  const [trips] = useState(tripsData);
  const [personalItineraryItems, setPersonalItineraryItems] = useState([]);
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [newTripData, setNewTripData] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    budgetRange: "medium",
    tags: [],
    days: []
  });

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

  // Add function to add a trip to personal itinerary
  const handleAddToItinerary = (tripId) => {
    // Check if this trip is already in the itinerary
    if (personalItineraryItems.some(item => item.tripId === tripId)) {
      alert("This trip is already in your personal itinerary!");
      return;
    }

    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const newItem = {
      id: Date.now(), // Generate a unique ID
      tripId: tripId,
      userStartDate: trip.startDate, // Initial value same as trip's original date
      userEndDate: trip.endDate
    };

    setPersonalItineraryItems(prev => [...prev, newItem]);
  };

  // Remove a trip from personal itinerary
  const handleRemoveFromItinerary = (itemId) => {
    setPersonalItineraryItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCreateTrip = () => {
    // Validate required fields
    if (!newTripData.title || !newTripData.location || !newTripData.startDate || !newTripData.endDate) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new trip with a unique ID
    const newTrip = {
      ...newTripData,
      id: Math.max(...trips.map(t => t.id), 0) + 1,
      image: "https://source.unsplash.com/featured/?nature,travel" // Default placeholder image
    };

    // In a real app, this would save to a database
    // For now, we'll just navigate to the new trip's itinerary
    console.log("New trip created:", newTrip);

    // Navigate to the new trip's itinerary
    navigate(`/itinerary/${newTrip.id}`);
  };

  const handleNewTripInputChange = (e) => {
    const { name, value } = e.target;
    setNewTripData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleTagInNewTrip = (tag) => {
    setNewTripData(prev => {
      const currentTags = [...prev.tags];
      if (currentTags.includes(tag)) {
        return { ...prev, tags: currentTags.filter(t => t !== tag) };
      } else {
        return { ...prev, tags: [...currentTags, tag] };
      }
    });
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
          {!showNewTripForm ? (
            <>
              <div className="text-center mb-5 d-flex justify-content-between align-items-center">
                <h1 className="mb-0 text-center flex-grow-1">Travel Plans</h1>
                <Button
                  variant="success"
                  className="d-flex align-items-center"
                  onClick={() => setShowNewTripForm(true)}
                >
                  <Plus size={18} className="me-1" /> Create New Trip
                </Button>
              </div>
              <p className="text-muted text-center mb-4">
                Select a trip to view detailed itinerary
              </p>

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
                <TripList
                  trips={filteredTrips}
                  onTripSelect={handleTripSelect}
                  formatDate={formatDate}
                  calculateDuration={calculateDuration}
                  onAddToItinerary={handleAddToItinerary}
                />
              ) : (
                <div className="text-center py-5">
                  <h4 className="text-muted">No trips match your filters</h4>
                  <Button variant="outline-forest" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowNewTripForm(false)}
                >
                  Back to Trips
                </Button>
                <h2 className="mb-0">Create New Trip</h2>
                <div style={{ width: "100px" }}></div> {/* Spacer for alignment */}
              </div>

              <Card className="shadow-sm">
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Trip Title*</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            placeholder="Enter trip title"
                            value={newTripData.title}
                            onChange={handleNewTripInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Location*</Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            placeholder="Enter location"
                            value={newTripData.location}
                            onChange={handleNewTripInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Start Date*</Form.Label>
                          <Form.Control
                            type="date"
                            name="startDate"
                            value={newTripData.startDate}
                            onChange={handleNewTripInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>End Date*</Form.Label>
                          <Form.Control
                            type="date"
                            name="endDate"
                            value={newTripData.endDate}
                            onChange={handleNewTripInputChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        rows={3}
                        placeholder="Enter trip description"
                        value={newTripData.description}
                        onChange={handleNewTripInputChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Budget Range</Form.Label>
                      <Form.Select
                        name="budgetRange"
                        value={newTripData.budgetRange}
                        onChange={handleNewTripInputChange}
                      >
                        <option value="low">Budget ($)</option>
                        <option value="medium">Moderate ($$)</option>
                        <option value="high">Luxury ($$$)</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Tags</Form.Label>
                      <div className="d-flex flex-wrap gap-2">
                        {allTags.map((tag) => (
                          <Badge
                            key={tag}
                            bg={newTripData.tags.includes(tag) ? "forest" : "light"}
                            text={newTripData.tags.includes(tag) ? "white" : "dark"}
                            onClick={() => toggleTagInNewTrip(tag)}
                            style={{ cursor: "pointer" }}
                            className="p-2"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowNewTripForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="success" onClick={handleCreateTrip}>
                        Create Trip
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          )}
        </div>

        {/* Only show Personal Itinerary when not in new trip form */}
        {!showNewTripForm && (
          <div className="mt-4">
            <PersonalItinerary
              personalItineraryItems={personalItineraryItems}
              allTrips={trips}
              onRemoveFromItinerary={handleRemoveFromItinerary}
              formatDate={formatDate}
            />
          </div>
        )}
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
