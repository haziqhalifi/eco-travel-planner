import React from 'react';
import { Card, Button, ListGroup, Col, Row } from 'react-bootstrap';
import { Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PersonalItinerary = ({ personalTrips, onRemoveFromItinerary, formatDate }) => {
   const navigate = useNavigate();

   if (!personalTrips || personalTrips.length === 0) {
      return (
         <div className="mt-4 p-3 bg-light rounded shadow-sm text-center">
            <p className="text-muted mb-0">Your personal collection is empty.</p>
            <small>Add trips from the list above to get started!</small>
         </div>
      );
   }

   return (
      <div className="mt-5">
         <h2 className="fw-bold text-forest mb-3">My Personal Trip Collection</h2>
         <Card className="shadow-sm">
            <ListGroup variant="flush">
               {personalTrips.map(trip => {
                  return (
                     <ListGroup.Item key={trip.id} className="p-3">
                        <Row className="align-items-center">
                           <Col md={8}>
                              <h5 className="mb-1 text-forest">{trip.title}</h5>
                              <small className="text-muted">{trip.location}</small>
                              <div className="mt-2">
                                 <small className="text-muted">
                                    Dates: {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                                 </small>
                              </div>
                              {trip.personalTripId && (
                                 <div className="mt-1">
                                    <small className="text-info">✓ Customized version</small>
                                 </div>
                              )}
                           </Col>
                           <Col md={4} className="text-md-end d-flex flex-column flex-md-row justify-content-end align-items-stretch">
                              <Button
                                 variant="outline-secondary"
                                 size="sm"
                                 className="mb-2 mb-md-0 me-md-2 d-flex align-items-center justify-content-center"
                                 onClick={() => navigate(`/itinerary/${trip.id}`)}
                                 aria-label={`Edit activities for ${trip.title}`}
                              >
                                 <Edit3 size={16} className="me-1" /> Edit
                              </Button>
                              <Button
                                 variant="outline-danger"
                                 size="sm"
                                 className="d-flex align-items-center justify-content-center"
                                 onClick={() => onRemoveFromItinerary && onRemoveFromItinerary(trip.id)}
                                 aria-label={`Remove ${trip.title} from collection`}
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