import React, {useEffect, useState} from "react";
import {
  Card,
  Form,
  Button,
  ListGroup, Alert,
} from "react-bootstrap";
import {
  Calendar,
  MapPin,
  Coffee,
  Compass,
  Utensils,
  Building,
  Trash2,
} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import {personalTripsAPI, tripsAPI} from "../services/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

function Itinerary({editable}) {
  const {tripId} = useParams();
  const [trip, setTrip] = useState(null);
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    let trip;
    if (editable) {
      trip = getPersonalTripById(tripId);
    } else {
      trip = getSelectedTrip(tripId);
    }

    setTrip(trip);
    console.log(trip)
  }, [tripId, navigate]);

  const [newActivity, setNewActivity] = useState({
    date: "",
    time: "",
    place: "",
    icon: "compass",
    details: "",
  });

  const [newTripTitle, setNewTripTitle] = useState("");
  const [newTripStart, setNewTripStart] = useState("");
  const [newTripEnd, setNewTripEnd] = useState("");
  const [showNewTrip, setShowNewTrip] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getSelectedTrip = async (tripId) => {
    try {
      setIsLoading(true);
      setError("")
      const response = await tripsAPI.getTripById(tripId);
      setTrip(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonalTripById = async (tripId) => {


    try {
      setIsLoading(true);
      setError("");
      const response = await personalTripsAPI.getPersonalTripById(tripId);
      setTrip(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDayNumber = (date, startDate) => {
    const start = new Date(startDate);
    const current = new Date(date);
    const diffTime = current - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays}${getDaySuffix(diffDays)} day`;
  };

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "plane":
        return <MapPin size={20}/>;
      case "coffee":
        return <Coffee size={20}/>;
      case "compass":
        return <Compass size={20}/>;
      case "food":
        return <Utensils size={20}/>;
      case "hotel":
        return <Building size={20}/>;
      default:
        return <MapPin size={20}/>;
    }
  };

  const handleBack = () => {
    navigate("/trip");
  };

  const handleNewActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.date || !newActivity.time || !newActivity.place) return;

    if (newActivity.date < trip.startDate || newActivity.date > trip.endDate) {
      setError("Date must be between start date and end date");
      return;
    }

    try {
      const details = {
        date: newActivity.date,
        activity: {
          time: newActivity.time,
          place: newActivity.place,
          icon: newActivity.icon,
          details: newActivity.details,
        }
      };
      const response = await personalTripsAPI.addCustomActivity(tripId, details);
      setTrip(response.data);
      setNewActivity({
        date: "",
        time: "",
        place: "",
        icon: "compass",
        details: "",
      });
    } catch (error) {
      setError(error.message);
    }

    // const updatedTrip = {...trip};
    // const dayIndex = updatedTrip.days.findIndex(
    //     (day) => day.date === newActivity.date
    // );
    //
    // if (dayIndex >= 0) {
    //   updatedTrip.days[dayIndex].activities.push({...newActivity});
    //   updatedTrip.days[dayIndex].activities.sort((a, b) =>
    //       a.time.localeCompare(b.time)
    //   );
    // } else {
    //   updatedTrip.days.push({
    //     date: newActivity.date,
    //     activities: [{...newActivity}],
    //   });
    //   updatedTrip.days.sort((a, b) => a.date.localeCompare(b.date));
    // }

    // setTrip(updatedTrip);
    // setNewActivity({
    //   date: "",
    //   time: "",
    //   place: "",
    //   icon: "compass",
    //   details: "",
    // });
  };

  const createNewTrip = () => {
    if (!newTripTitle || !newTripStart || !newTripEnd) return;

    setTrip({
      title: newTripTitle,
      startDate: newTripStart,
      endDate: newTripEnd,
      days: [],
    });

    setShowNewTrip(false);
  };

  const handleDeleteActivity = async ( activityId) => {
    const response = await personalTripsAPI.deleteActivity(tripId, activityId);
    setTrip(response.data);
    // const updatedTrip = {...trip};
    // updatedTrip.days[dayIndex].activities.splice(activityIndex, 1);
    //
    // if (updatedTrip.days[dayIndex].activities.length === 0) {
    //   updatedTrip.days.splice(dayIndex, 1);
    // }
    //
    // setTrip(updatedTrip);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const formatDate = (dateString) => {
    const options = {month: "short", day: "numeric", year: "numeric"};
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  return (
      <div className="bg-light min-vh-100 py-8">
        <div className="container mx-auto my-8">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            {error && (
                <Alert variant="danger" dismissible onClose={() => setError("")}>
                  {error}
                </Alert>
            )}
            {!showNewTrip ? (
                <>
                  {/*title */}
                  <div className="mb-4">
                    <div className="">
                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={handleBack}
                        >
                          <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                          >
                            <path d="M15 18l-6-6 6-6"/>
                          </svg>
                        </Button>

                        {editable &&
                            <Button
                                variant={isEditMode ? "success" : "outline-primary"}
                                size="sm"
                                onClick={toggleEditMode}
                            >

                              {isEditMode ? "Save Changes" : "Edit Itinerary"}
                            </Button>}

                      </div>
                      <div className="text-center text-forest">
                        <h2 className="mt-3 mb-0 fw-bold fs-2 ">{trip.title}</h2>
                        <div className="text-muted text-center mt-2 d-flex align-items-center justify-content-center">
                          <Calendar size={16} className="me-1 "/>
                          <span className="text-forest mx-2">
                        {new Date(trip.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                            –{" "}
                            {new Date(trip.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                      </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/*trip day*/}
                  {trip.days.map((day, dayIndex) => (
                      <Card
                          key={dayIndex}
                          className="shadow-sm mb-3 border-0"
                          style={{backgroundColor: "#F5F8F5"}}
                      >
                        <Card.Header
                            className=" py-3 border-bottom"
                            style={{backgroundColor: "#F5F8F5"}}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-semibold text-forest">
                              {formatDate(day.date)}
                            </h5>
                            <span className="text-muted">
                        {getDayNumber(day.date, trip.startDate)}
                      </span>
                          </div>
                        </Card.Header>

                        {/*activities*/}
                        <ListGroup variant="flush">
                          {day.activities.map((activity, index) => (
                              <ListGroup.Item
                                  key={index}
                                  className="border-0 py-3"
                                  style={{backgroundColor: "#F5F8F5"}}
                              >
                                <div className="d-flex">
                                  {/*time*/}
                                  <div className="text-center pt-1">
                                    <p className="me-4 text-forest">
                                      {activity.time.substring(0, 2)}
                                      {activity.time.substring(2)}{" "}
                                      {parseInt(activity.time) >= 12 ? "PM" : "AM"}
                                    </p>
                                  </div>

                                  {/*icon*/}
                                  <div
                                      className="text-center me-3"
                                      style={{width: "50px"}}
                                  >
                                    <div
                                        className="rounded-circle d-flex align-items-center justify-content-center text-white"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                          backgroundColor: "#4A7856",
                                        }}
                                    >
                                      {getIcon(activity.icon)}
                                    </div>
                                  </div>

                                  <div className="pt-2 d-flex flex-column text-start flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                      <h6 className="mb-1 text-forest fw-semibold align-content-start">
                                        {activity.place}
                                      </h6>

                                      {isEditMode && (
                                          <Button
                                              variant="outline-danger"
                                              size="sm"
                                              className="p-1"
                                              onClick={() => handleDeleteActivity(activity._id)}
                                              aria-label={`Delete ${activity.place}`}
                                          >
                                            <Trash2 size={16}/>
                                          </Button>
                                      )}
                                    </div>

                                    {activity.imageUrl && (
                                        <img
                                            src={activity.imageUrl}
                                            className="mt-2 rounded-3"
                                            style={{height: "200px"}}
                                        />
                                    )}
                                    {activity.details && (
                                        <div className="small text-forest d-flex ">
                                          {activity.details}
                                        </div>
                                    )}
                                  </div>
                                </div>
                              </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card>
                  ))}

                  {/* Only show Add Activity section in edit mode */}
                  {isEditMode && (
                      <Card className="shadow-sm mt-4">
                        <Card.Header className="bg-white">
                          <h5 className="mb-0">Add New Activity</h5>
                        </Card.Header>
                        <Card.Body>
                          <Form onSubmit={handleNewActivity}>
                            <Form.Group className="mb-3">
                              <Form.Label>Date</Form.Label>
                              <Form.Control
                                  type="date"
                                  value={newActivity.date}
                                  onChange={(e) =>
                                      setNewActivity({
                                        ...newActivity,
                                        date: e.target.value,
                                      })
                                  }
                                  required
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Time</Form.Label>
                              <Form.Control
                                  type="time"
                                  value={newActivity.time}
                                  onChange={(e) =>
                                      setNewActivity({
                                        ...newActivity,
                                        time: e.target.value,
                                      })
                                  }
                                  required
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Place</Form.Label>
                              <Form.Control
                                  type="text"
                                  placeholder="Enter place name"
                                  value={newActivity.place}
                                  onChange={(e) =>
                                      setNewActivity({
                                        ...newActivity,
                                        place: e.target.value,
                                      })
                                  }
                                  required
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Icon</Form.Label>
                              <Form.Select
                                  value={newActivity.icon}
                                  onChange={(e) =>
                                      setNewActivity({
                                        ...newActivity,
                                        icon: e.target.value,
                                      })
                                  }
                              >
                                <option value="plane">Airplane</option>
                                <option value="coffee">Coffee</option>
                                <option value="compass">Explore</option>
                                <option value="food">Food</option>
                                <option value="hotel">Hotel</option>
                              </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Details (Optional)</Form.Label>
                              <Form.Control
                                  type="text"
                                  placeholder="Additional information"
                                  value={newActivity.details}
                                  onChange={(e) =>
                                      setNewActivity({
                                        ...newActivity,
                                        details: e.target.value,
                                      })
                                  }
                              />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                              Add Activity
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                  )}

                  {/* <div className="text-center mt-4">
                <Button
                  variant="outline-primary"
                  onClick={() => setShowNewTrip(true)}
                >
                  Create New Trip
                </Button>
              </div> */}
                </>
            ) : (
                <Card className="shadow-sm">
                  <Card.Header className="bg-white">
                    <h5 className="mb-0">Create New Trip</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Trip Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter trip title"
                            value={newTripTitle}
                            onChange={(e) => setNewTripTitle(e.target.value)}
                            required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={newTripStart}
                            onChange={(e) => setNewTripStart(e.target.value)}
                            required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={newTripEnd}
                            onChange={(e) => setNewTripEnd(e.target.value)}
                            required
                        />
                      </Form.Group>
                      <div className="d-flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setShowNewTrip(false)}
                        >
                          Cancel
                        </Button>
                        <Button variant="primary" onClick={createNewTrip}>
                          Create Trip
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
            )}
          </div>
        </div>
        <style jsx>{`
            .bg-forest {
                background-color: #1a472a;
            }
        `}</style>
      </div>
  );
}

export default Itinerary;
