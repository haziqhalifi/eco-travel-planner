import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { MapPin, Calendar, ArrowRight, PlusCircle } from 'lucide-react';

const TripCard = ({ trip, onTripSelect, formatDate, calculateDuration, onAddToItinerary }) => {
   if (!trip) {
      return null; // Or some placeholder/loading state
   }

   return (
      <Card
         className="h-100 shadow-sm border-0 trip-card"
         style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
         onClick={() => onTripSelect(trip.id)}
      >
         <div style={{ height: '200px', overflow: 'hidden' }}>
            <Card.Img
               variant="top"
               src={trip.image}
               alt={trip.title}
               style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            />
         </div>
         <Card.Body className="d-flex flex-column">
            <div className="d-flex align-items-center mb-2">
               <MapPin size={16} className="text-forest me-1" />
               <span className="text-muted small">{trip.location}</span>
               <Badge bg="light" text="dark" className="ms-auto px-2 py-1">
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

            {/* Tags */}
            <div className="mb-3">
               {trip.tags && trip.tags.map(tag => (
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

            {/* Price Indicator, Add to Itinerary Button, and View Itinerary Link */}
            <div className="mt-auto d-flex justify-content-between align-items-center">
               <span className={`fw-semibold small ${trip.budgetRange === 'low' ? 'text-success' :
                  trip.budgetRange === 'high' ? 'text-warning' : 'text-forest'
                  }`}>
                  {trip.budgetRange === 'low' ? '$' :
                     trip.budgetRange === 'medium' ? '$$' : '$$$'}
               </span>
               <div className="d-flex align-items-center">
                  <Button
                     variant="outline-primary"
                     size="sm"
                     className="me-3 d-flex align-items-center"
                     onClick={(e) => {
                        e.stopPropagation();
                        if (onAddToItinerary) {
                           onAddToItinerary(trip.id);
                        }
                     }}
                     aria-label="Add to Itinerary"
                  >
                     <PlusCircle size={16} className="me-1" />
                     Add
                  </Button>
                  <div
                     className="d-flex align-items-center text-forest view-itinerary-link"
                     onClick={() => {
                        // This onClick is likely redundant if the parent Card handles navigation.
                        // If specific behavior is needed here, it can be added.
                        // onTripSelect(trip.id); // Example: could also trigger navigation
                     }}
                  >
                     <span className="fw-semibold small">View Itinerary</span>
                     <ArrowRight size={16} className="ms-1" />
                  </div>
               </div>
            </div>
         </Card.Body>
      </Card>
   );
};

export default TripCard; 