import React from 'react';
import { Row, Col } from 'react-bootstrap';
import TripCard from './TripCard';

const TripList = ({ trips, onTripSelect, formatDate, calculateDuration, onAddToItinerary }) => {
   if (!trips || trips.length === 0) {
      return (
         <div className="text-center my-5">
            <p className="text-muted fs-5">No trips match your current filters.</p>
            <p>Try adjusting your search or filters.</p>
         </div>
      );
   }

   return (
      <Row className="g-4">
         {trips.map((trip) => (
            <Col key={trip.id} md={6} lg={4}>
               <TripCard
                  trip={trip}
                  onTripSelect={onTripSelect}
                  formatDate={formatDate}
                  calculateDuration={calculateDuration}
                  onAddToItinerary={onAddToItinerary}
               />
            </Col>
         ))}
      </Row>
   );
};

export default TripList; 