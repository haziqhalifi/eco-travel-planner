import React from 'react';
import { Card, Button, ListGroup, Col, Row } from 'react-bootstrap';
import { Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonalItinerary = ({ personalItineraryItems, allTrips, onRemoveFromItinerary, formatDate }) => {
   const navigate = useNavigate();

   if (!personalItineraryItems || personalItineraryItems.length === 0) {
      return (
         <div className="mt-4 p-3 bg-light rounded shadow-sm text-center">
            <p className="text-muted mb-0">Your personal itinerary is empty.</p>
            <small>Add trips from the list above to get started!</small>
         </div>
      );
   }

   return (
      <div className="mt-5">
         <h2 className="fw-bold text-forest mb-3">My Personal Itinerary</h2>
         <Card className="shadow-sm">
            <ListGroup variant="flush">
               {personalItineraryItems.map(item => {
                  const tripDetails = allTrips.find(t => t.id === item.tripId);
                  if (!tripDetails) {
                     // This itinerary item references a trip not found in allTrips
                     // Should ideally not happen, but good to handle
                     console.warn(`Trip details not found for tripId: ${item.tripId}`);
                     return (
                        <ListGroup.Item key={item.id} variant="danger">
                           Error: Trip data missing for an item in your itinerary.
                        </ListGroup.Item>
                     );
                  }

                  return (
                     <ListGroup.Item key={item.id} className="p-3">
                        <Row className="align-items-center">
                           <Col md={8}>
                              <h5 className="mb-1 text-forest">{tripDetails.title}</h5>
                              <small className="text-muted">{tripDetails.location}</small>
                              <div className="mt-2">
                                 <small className="text-muted">
                                    Dates: {formatDate(tripDetails.startDate)} - {formatDate(tripDetails.endDate)}
                                 </small>
                              </div>
                           </Col>
                           <Col md={4} className="text-md-end d-flex flex-column flex-md-row justify-content-end align-items-stretch">
                              <Button
                                 variant="outline-secondary"
                                 size="sm"
                                 className="mb-2 mb-md-0 me-md-2 d-flex align-items-center justify-content-center"
                                 onClick={() => navigate(`/itinerary/${tripDetails.id}`)}
                                 aria-label={`Edit activities for ${tripDetails.title}`}
                              >
                                 <Edit3 size={16} className="me-1" /> Edit
                              </Button>
                              <Button
                                 variant="outline-danger"
                                 size="sm"
                                 className="d-flex align-items-center justify-content-center"
                                 onClick={() => onRemoveFromItinerary && onRemoveFromItinerary(item.id)}
                                 aria-label={`Remove ${tripDetails.title} from itinerary`}
                              >
                                 <Trash2 size={16} className="me-1" /> Remove
                              </Button>
                           </Col>
                        </Row>
                     </ListGroup.Item>
                  );
               })}
            </ListGroup>
         </Card>
      </div>
   );
};

export default PersonalItinerary; 