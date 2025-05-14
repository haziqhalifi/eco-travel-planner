import React from 'react';
import {
   Row,
   Col,
   InputGroup,
   Form,
   Button,
   Dropdown,
   Badge,
} from 'react-bootstrap';
import { Search, X, Filter } from 'lucide-react';

const TripFilterBar = ({
   searchTerm,
   priceRange,
   selectedTags,
   allTags,
   priceRanges,
   onSearchChange,
   onPriceChange,
   onTagToggle,
   onClearFilters,
   onClearSearch,
   onClearPrice,
}) => {
   return (
      <div className="mb-4 p-3 bg-white rounded shadow-sm">
         <Row className="align-items-end">
            <Col md={6} className="mb-3 mb-md-0">
               <Form.Label htmlFor="searchInput" className="fw-semibold">Search Trips</Form.Label>
               <InputGroup>
                  <InputGroup.Text>
                     <Search size={18} />
                  </InputGroup.Text>
                  <Form.Control
                     id="searchInput"
                     placeholder="Search by name or location..."
                     value={searchTerm}
                     onChange={onSearchChange}
                  />
                  {searchTerm && (
                     <Button variant="outline-secondary" onClick={onClearSearch} aria-label="Clear search">
                        <X size={18} />
                     </Button>
                  )}
               </InputGroup>
            </Col>

            <Col md={3} className="mb-3 mb-md-0">
               <Form.Label htmlFor="priceRangeSelect" className="fw-semibold">Price Range</Form.Label>
               <Form.Select
                  id="priceRangeSelect"
                  value={priceRange}
                  onChange={onPriceChange}
                  aria-label="Select price range"
               >
                  {priceRanges.map(range => (
                     <option key={range.value} value={range.value}>
                        {range.label}
                     </option>
                  ))}
               </Form.Select>
            </Col>

            <Col md={3} className="mb-3 mb-md-0">
               <Form.Label className="fw-semibold">Filter by Tags</Form.Label>
               <Dropdown>
                  <Dropdown.Toggle variant="outline-forest" id="tags-dropdown" className="w-100 d-flex justify-content-between align-items-center">
                     <Filter size={18} className="me-1" />
                     <span className="flex-grow-1 text-start">
                        {selectedTags.length > 0 ? `${selectedTags.length} tag(s) selected` : 'Select Tags'}
                     </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="p-3 w-100 shadow">
                     <div className="d-flex flex-wrap gap-2 mb-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {allTags.map(tag => (
                           <Button
                              key={tag}
                              variant={selectedTags.includes(tag) ? 'forest' : 'light'}
                              size="sm"
                              onClick={() => onTagToggle(tag)}
                              className="rounded-pill"
                           >
                              {tag}
                           </Button>
                        ))}
                     </div>
                     {selectedTags.length > 0 && (
                        <Button
                           variant="link"
                           size="sm"
                           className="p-0 text-danger text-decoration-none"
                           onClick={onClearFilters} // This should clear all filters including tags
                        >
                           Clear all filters
                        </Button>
                     )}
                  </Dropdown.Menu>
               </Dropdown>
            </Col>
         </Row>

         {/* Active filters indicator */}
         {(searchTerm || selectedTags.length > 0 || priceRange !== 'all') && (
            <div className="mt-3 pt-3 border-top">
               <small className="text-muted me-2">Active filters:</small>
               {searchTerm && (
                  <Badge pill bg="light" text="dark" className="me-2 mb-1 p-2 d-inline-flex align-items-center">
                     Search: "{searchTerm}"
                     <X size={16} onClick={onClearSearch} style={{ cursor: 'pointer', marginLeft: '0.25rem' }} />
                  </Badge>
               )}
               {selectedTags.map(tag => (
                  <Badge key={tag} pill bg="forest" text="white" className="me-2 mb-1 p-2 d-inline-flex align-items-center">
                     {tag}
                     <X size={16} onClick={() => onTagToggle(tag)} style={{ cursor: 'pointer', marginLeft: '0.25rem' }} />
                  </Badge>
               ))}
               {priceRange !== 'all' && (
                  <Badge pill bg="light" text="dark" className="me-2 mb-1 p-2 d-inline-flex align-items-center">
                     Price: {priceRanges.find(r => r.value === priceRange)?.label}
                     <X size={16} onClick={onClearPrice} style={{ cursor: 'pointer', marginLeft: '0.25rem' }} />
                  </Badge>
               )}
            </div>
         )}
      </div>
   );
};

export default TripFilterBar; 