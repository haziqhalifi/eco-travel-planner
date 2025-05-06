import { useState } from 'react';
import axios from 'axios';
import { Search, Heart } from 'lucide-react';
import AccommodationCard from './AccommodationCard.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { searchConfigs } from './SearchConfigs';
import {FlightCard} from "./FlightCard.jsx";
import ActivityCard from "./ActivityCard.jsx";

const EcoOptions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(50);
  const [travelOptions, setTravelOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [adults, setAdults] = useState(2);
  const [activeTab, setActiveTab] = useState('accommodation'); // Default tab is 'accommodation'
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);


  const [filters, setFilters] = useState({
    accommodation: false,
    transportation: false,
    activity: false,
    restaurant: false,
  });

  const handleFilterChange = (filter) => {
    setFilters({
      ...filters,
      [filter]: !filters[filter],
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    const cfg = searchConfigs[activeTab]; // Use the active tab to get config

    let allInputs = {};

    if (activeTab === 'accommodation') {
      allInputs = {
        searchTerm,
        checkInDate,
        checkOutDate,
        adults,
      };
    } else if (activeTab === 'transportation') {
      allInputs = {
        origin,
        destination,
        departureDate,
        returnDate,
      };
    } else if (activeTab === 'activity') {
      allInputs = {
        searchTerm,
      };
    } else if (activeTab === 'restaurant') {
      allInputs = {
        searchTerm,
      };
    }

    const params = cfg.buildParams(allInputs);

    try {
      let res;
      if (cfg.method === 'get') {
        res = await axios.get(cfg.endpoint, { params });
      } else {
        res = await axios.post(cfg.endpoint, params);
      }

      console.log("API response:", res.data);
      const items = cfg.mapResults(res.data);
      console.log("Mapped items for", activeTab, ":", items);
      setTravelOptions(items);
    } catch (err) {
      console.error(`Error fetching ${activeTab}`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex flex-col bg-gradient-to-r from-green-800 to-blue-800">
        {/* Hero Banner */}
        <div className="py-16 px-4 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2">Eco-Friendly Travel Options</h1>
            <p className="text-xl">Discover sustainable accommodations, transportation, and activities</p>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto flex-grow px-4 pb-12">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className="md:w-1/4 bg-white rounded-lg p-6 shadow-md h-fit">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="mb-6">
                <h3 className="font-medium mb-2">Type</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="accommodation"
                        className="mr-2"
                        checked={filters.accommodation}
                        onChange={() => handleFilterChange('accommodation')}
                    />
                    <label htmlFor="accommodation">Accommodation</label>
                  </div>
                  <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="transportation"
                        className="mr-2"
                        checked={filters.transportation}
                        onChange={() => handleFilterChange('transportation')}
                    />
                    <label htmlFor="transportation">Transportation</label>
                  </div>
                  <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="activity"
                        className="mr-2"
                        checked={filters.activity}
                        onChange={() => handleFilterChange('activity')}
                    />
                    <label htmlFor="activity">Activity</label>
                  </div>
                  <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="restaurant"
                        className="mr-2"
                        checked={filters.restaurant}
                        onChange={() => handleFilterChange('restaurant')}
                    />
                    <label htmlFor="restaurant">Restaurant</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">Up to ${priceRange}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="20000"
                    step="10"
                    className="w-full"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Main Interaction & Results */}
            <div className="md:w-3/4 flex flex-col space-y-4">
              {/* Tabs for different categories */}
              <div className="flex space-x-4 mb-4">
                <button
                    className={`py-2 px-4 rounded-lg ${activeTab === 'accommodation' ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}
                    onClick={() => setActiveTab('accommodation')}
                >
                  Accommodation
                </button>
                <button
                    className={`py-2 px-4 rounded-lg ${activeTab === 'transportation' ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}
                    onClick={() => setActiveTab('transportation')}
                >
                  Transportation
                </button>
                <button
                    className={`py-2 px-4 rounded-lg ${activeTab === 'activity' ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}
                    onClick={() => setActiveTab('activity')}
                >
                  Activity
                </button>
                <button
                    className={`py-2 px-4 rounded-lg ${activeTab === 'restaurant' ? 'bg-green-600 text-white' : 'bg-white text-green-600'}`}
                    onClick={() => setActiveTab('restaurant')}
                >
                  Restaurant
                </button>
              </div>

              {activeTab === 'accommodation' && (
                  <div>
                    {/* Search Bar */}
                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                          type="text"
                          placeholder="Search by name, description, or location"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Date Pickers & Adults Dropdown */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <DatePicker
                          selected={checkInDate}
                          onChange={(date) => setCheckInDate(date)}
                          selectsStart
                          startDate={checkInDate}
                          endDate={checkOutDate}
                          placeholderText="Check-in"
                          className="py-2 px-3 border rounded-lg w-full md:w-auto"
                      />
                      <DatePicker
                          selected={checkOutDate}
                          onChange={(date) => setCheckOutDate(date)}
                          selectsEnd
                          startDate={checkInDate}
                          endDate={checkOutDate}
                          minDate={checkInDate}
                          placeholderText="Check-out"
                          className="py-2 px-3 border rounded-lg w-full md:w-auto"
                      />
                      <select
                          value={adults}
                          onChange={(e) => setAdults(Number(e.target.value))}
                          className="py-2 px-3 border rounded-lg w-full md:w-auto"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num} Adult{num > 1 ? 's' : ''}
                            </option>
                        ))}
                      </select>
                      <button
                          onClick={handleSearch}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                      >
                        Search
                      </button>
                    </div>
                  </div>
              )}

              {/* Conditional Rendering for Transportation Search */}
              {activeTab === 'transportation' && (
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* All Four Elements in a Row */}
                    <div className="flex gap-6 w-full">
                      {/* Origin Location Search Bar */}
                      <div className="relative w-1/4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search size={18} className="text-gray-400"/>
                        </div>
                        <input
                            type="text"
                            placeholder="Origin location"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={origin} // Use the origin state here
                            onChange={(e) => setOrigin(e.target.value)} // Update origin state on change
                        />
                      </div>

                      {/* Destination Location Search Bar */}
                      <div className="relative w-1/4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search size={18} className="text-gray-400"/>
                        </div>
                        <input
                            type="text"
                            placeholder="Destination location"
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={destination} // Use the destination state here
                            onChange={(e) => setDestination(e.target.value)} // Update destination state on change
                        />
                      </div>

                      {/* Departure Date Picker */}
                      <div className="w-1/4">
                        <DatePicker
                            selected={departureDate} // Assuming departureDate represents the Departure date
                            onChange={(date) => setDepartureDate(date)} // Update the state for departure date
                            selectsStart
                            startDate={departureDate}
                            endDate={returnDate}
                            placeholderText="Departure"
                            className="py-2 px-3 border rounded-lg w-full"
                        />
                      </div>

                      {/* Return Date Picker */}
                      <div className="w-1/4">
                        <DatePicker
                            selected={returnDate} // Assuming returnDate represents the Return date
                            onChange={(date) => setReturnDate(date)} // Update the state for return date
                            selectsEnd
                            startDate={departureDate}
                            endDate={returnDate}
                            minDate={departureDate} // Return date cannot be before the departure date
                            placeholderText="Return"
                            className="py-2 px-3 border rounded-lg w-full"
                        />
                      </div>
                    </div>

                    {/* Search Button (Aligned to the Right) */}
                    <div className="w-full text-right mt-4">
                      <button
                          onClick={handleSearch}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                      >
                        Search
                      </button>
                    </div>
                  </div>
              )}

              {activeTab === 'activity' && (
                  <div>
                    {/* Search Bar */}
                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                          type="text"
                          placeholder="Search by name, description, or location"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                      <button
                          onClick={handleSearch}
                          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                      >
                        Search
                      </button>
                    </div>
              )}

              {activeTab === 'restaurant' && (
                  <div>
                    {/* Search Bar */}
                    <div className="relative mb-4">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                      </div>
                      <input
                          type="text"
                          placeholder="Search by name, description, or location"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                    >
                      Search
                    </button>
                  </div>
              )}


              {/* Travel Options */}
              {loading ? (
                  <div className="text-white text-center text-lg mt-4">Loading eco-friendly options...</div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {travelOptions.map((option) => {
                      // Conditional rendering based on the activeTab
                      if (activeTab === 'accommodation') {
                        return (
                            <AccommodationCard
                                key={option.id}
                                type={option.type}
                                title={option.name}
                                rating={option.rating}
                                location={option.location}
                                description={option.description}
                                imageSrc={option.thumbnail}
                                price={option.price}
                            />
                        );
                      } else if (activeTab === 'transportation') {
                        return (
                            <FlightCard
                                key={option.id}
                                airline={option.airline}
                                flightNumber={option.flightNumber}
                                departureAirport={option.departureAirport}
                                arrivalAirport={option.arrivalAirport}
                                departureTime={option.departureTime}
                                arrivalTime={option.arrivalTime}
                                duration={option.duration}
                                stops={option.stops}
                                travelClass="Economy"
                                price={option.price}
                                emissions={option.emissions}
                                logoUrl={option.logoUrl}
                            />
                        );
                      } else if (activeTab === 'activity') {
                        return (
                            <ActivityCard
                                key={option.id}
                                name={option.name}
                                location={option.location}
                                rating={option.rating}
                                reviews={option.reviews}
                                priceLevel={option.priceLevel}
                                description={option.description}
                                image={option.image}
                                hours={option.hours}
                                links={option.links}
                                gps={option.gps}
                            />
                        );
                        } else if (activeTab === 'restaurant') {
                        return (
                            <ActivityCard
                                key={option.id}
                                name={option.name}
                                location={option.location}
                                rating={option.rating}
                                reviews={option.reviews}
                                priceLevel={option.priceLevel}
                                description={option.description}
                                image={option.image}
                                hours={option.hours}
                                links={option.links}
                                gps={option.gps}
                            />
                        );
                      }
                      return null; // In case there are no matching options (shouldn't happen)
                    })}
                  </div>
              )}
            </div>
          </div>
        </main>
      </div>
  );
};

export default EcoOptions;
