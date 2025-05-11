import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Calendar, Users, MapPin, Plane } from "lucide-react";
import AccommodationCard from "./AccommodationCard.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { searchConfigs } from "./SearchConfigs";
import { DetailedFlightCard, FlightCard } from "./FlightCard.jsx";
import ActivityCard, { ActivityDetailView } from "./ActivityCard.jsx";

const EcoOptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [travelOptions, setTravelOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [adults, setAdults] = useState(2);
  const [activeTab, setActiveTab] = useState("accommodation");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const cfg = searchConfigs[activeTab];

    let allInputs = {};

    if (activeTab === "accommodation") {
      allInputs = {
        searchTerm,
        checkInDate,
        checkOutDate,
        adults,
      };
    } else if (activeTab === "transportation") {
      allInputs = {
        origin,
        destination,
        departureDate,
        returnDate,
      };
    } else if (activeTab === "activity" || activeTab === "restaurant") {
      allInputs = {
        searchTerm,
      };
    }

    const params = cfg.buildParams(allInputs);

    try {
      let res;
      if (cfg.method === "get") {
        res = await axios.get(cfg.endpoint, {
          params,
          headers: {
            type: activeTab,
          },
        });
      } else {
        res = await axios.post(cfg.endpoint, params);
      }

      console.log("API response:", res.data);
      const items = cfg.mapResults(res.data) || [];
      console.log("Mapped items for", activeTab, ":", items);
      setTravelOptions(items);
    } catch (err) {
      console.error(`Error fetching ${activeTab}`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
  };
  const handleCloseDetails = () => {
    setSelectedFlight(null);
  };
  const handleActivityViewDetails = (activty) => {
    setSelectedItem(activty);
    setShowDetailView(true);
  };
  const handleActivityCloseDetails = () => {
    setSelectedItem(null);
  };

  useEffect(() => {
    // Clear all search-related states when tab changes
    setSearchTerm("");
    setTravelOptions([]);
    setSelectedItem(null);
    setShowDetailView(false);

    // Add any other state resets you need for specific tabs
    if (activeTab === "accommodation") {
      setCheckInDate(new Date());
      setCheckOutDate(new Date());
      setAdults(2);
    }
    if (activeTab === "transportation") {
      setOrigin("");
      setDestination("");
      setDepartureDate(null);
      setReturnDate(null);
    }
  }, [activeTab]);

  // Custom tab style
  const tabStyle = (isActive) =>
    `px-6 py-3 rounded-lg transition-all duration-300 text-lg font-medium ${
      isActive
        ? "bg-dark-green text-white shadow-md"
        : "bg-white text-gray-600 hover:bg-green-50"
    }`;

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
          <div className="text-center mb-5">
            <h1 className="mb-4">Eco-Friendly Travel Options</h1>
          </div>
          {/* Tabs for different categories */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <button
              className={tabStyle(activeTab === "accommodation")}
              onClick={() => setActiveTab("accommodation")}
            >
              Accommodation
            </button>
            <button
              className={tabStyle(activeTab === "transportation")}
              onClick={() => setActiveTab("transportation")}
            >
              Transportation
            </button>
            <button
              className={tabStyle(activeTab === "activity")}
              onClick={() => setActiveTab("activity")}
            >
              Activity
            </button>
            <button
              className={tabStyle(activeTab === "restaurant")}
              onClick={() => setActiveTab("restaurant")}
            >
              Restaurant
            </button>
          </div>

          {/* Search Forms */}
          <div className="mb-8">
            {activeTab === "accommodation" && (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">
                  Find Eco-Friendly Accommodations
                </h2>

                {/* Search Bar */}
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search size={20} className="text-green-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search destinations, properties, or features..."
                    className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Date Pickers & Adults Dropdown */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-green-600" />
                    </div>
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => setCheckInDate(date)}
                      selectsStart
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      placeholderText="Check-in"
                      className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-green-600" />
                    </div>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => setCheckOutDate(date)}
                      selectsEnd
                      startDate={checkInDate}
                      endDate={checkOutDate}
                      minDate={checkInDate}
                      placeholderText="Check-out"
                      className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Users size={18} className="text-green-600" />
                    </div>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none text-gray-700"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num} Adult{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="bg-dark-green hover:bg-green-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-300"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}

            {activeTab === "transportation" && (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">
                  Find Eco-Friendly Transportation
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Origin Location */}
                  <div className="relative md:col-span-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-green-600" />
                    </div>
                    <input
                      type="text"
                      placeholder="Origin"
                      className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                  </div>

                  {/* Destination Location */}
                  <div className="relative md:col-span-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Plane size={18} className="text-green-600" />
                    </div>
                    <input
                      type="text"
                      placeholder="Destination"
                      className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>

                  {/* Departure Date */}
                  <div className="relative md:col-span-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-green-600" />
                    </div>
                    <DatePicker
                      selected={departureDate}
                      onChange={(date) => setDepartureDate(date)}
                      selectsStart
                      startDate={departureDate}
                      endDate={returnDate}
                      placeholderText="Departure"
                      className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                    />
                  </div>

                  {/* Return Date */}
                  <div className="relative md:col-span-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-green-600" />
                    </div>
                    <DatePicker
                      selected={returnDate}
                      onChange={(date) => setReturnDate(date)}
                      selectsEnd
                      startDate={departureDate}
                      endDate={returnDate}
                      minDate={departureDate}
                      placeholderText="Return"
                      className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="bg-dark-green hover:bg-green-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-300"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}

            {(activeTab === "activity" || activeTab === "restaurant") && (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h2 className="text-2xl font-semibold text-green-700 mb-4">
                  {activeTab === "activity"
                    ? "Find Eco-Friendly Activities"
                    : "Find Eco-Friendly Restaurants"}
                </h2>

                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search size={20} className="text-green-600" />
                    </div>
                    <input
                      type="text"
                      placeholder={
                        activeTab === "activity"
                          ? "Search for activities, tours, or experiences..."
                          : "Search for restaurants, cafes, or cuisines..."
                      }
                      className="w-full pl-12 pr-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="bg-dark-green hover:bg-green-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-300 md:w-auto w-full"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Travel Options Results */}
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <>
                {travelOptions.length > 0 ? (
                  <div
                    className={`grid gap-6 ${
                      activeTab === "transportation"
                        ? "grid-cols-1"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {travelOptions.map((option) => {
                      if (activeTab === "accommodation") {
                        return (
                          <AccommodationCard
                            key={option.id}
                            type={option.type}
                            title={option.name}
                            rating={option.rating}
                            location={option.address}
                            description={option.description}
                            image={option.image}
                            price={option.price}
                          />
                        );
                      } else if (activeTab === "transportation") {
                        return (
                          <>
                            <FlightCard
                              key={option.id}
                              airline={option.airline}
                              flightNumber={option.flightNumber}
                              departureAirport={option.departureAirport}
                              departureTime={option.departureTime}
                              arrivalAirport={option.arrivalAirport}
                              arrivalTime={option.arrivalTime}
                              total_duration={option.total_duration}
                              stops={option.stops}
                              stops_description={
                                option.stops_description || "Non-stop"
                              } // Default value
                              travelClass="Economy"
                              price={option.price}
                              emissions={option.emissions}
                              logoUrl={option.logoUrl}
                              all_airlines={option.all_airlines || []} // Ensure it's passed
                              onViewDetails={() => handleViewDetails(option)}
                            />
                            {activeTab === "transportation" &&
                              selectedFlight && (
                                <DetailedFlightCard
                                  flights={selectedFlight.legs}
                                  layovers={selectedFlight.layovers}
                                  stops_description={
                                    selectedFlight.stops_description ||
                                    "Non-stop"
                                  }
                                  total_duration={selectedFlight.total_duration}
                                  price={selectedFlight.price}
                                  emissions={selectedFlight.emissions}
                                  travelClass={selectedFlight.travelClass}
                                  extensions={selectedFlight.extensions}
                                  onClose={handleCloseDetails}
                                />
                              )}
                          </>
                        );
                      } else if (
                        activeTab === "activity" ||
                        activeTab === "restaurant"
                      ) {
                        return (
                          <>
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
                              onViewDetails={() =>
                                handleActivityViewDetails(option)
                              }
                            />
                            {showDetailView && selectedItem && (
                              <ActivityDetailView
                                item={selectedItem}
                                onClose={() => setShowDetailView(false)}
                              />
                            )}
                          </>
                        );
                      }
                      return null;
                    })}

                    {!loading && travelOptions.length === 0 && (
                      <div className="text-center text-gray-500">
                        No results found. Try different search criteria.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-green-600 mb-4">
                      <Search size={48} className="mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500">
                      Start your search to discover eco-friendly options
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoOptions;
