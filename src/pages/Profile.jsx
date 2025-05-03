import React, { useState } from 'react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Dummy user data boss
  const userData = {
    name: 'Jane Smith',
    username: 'eco_jane',
    email: 'jane.smith@example.com',
    location: 'Portland, OR',
    bio: 'Passionate environmentalist and traveler. Always looking for sustainable ways to explore our beautiful planet.',
    tripCount: 12,
    followersCount: 245,
    followingCount: 128,
    carbonSaved: 1250,
    profileImage: '/api/placeholder/150/150'
  };
  
  // Mock trips data
  const trips = [
    {
      id: 1,
      title: 'Hiking in the Redwoods',
      location: 'California, USA',
      date: 'April 2024',
      image: '/api/placeholder/300/200',
      carbonSaved: 120
    },
    {
      id: 2,
      title: 'Train Journey through Europe',
      location: 'Multiple Countries, Europe',
      date: 'March 2024',
      image: '/api/placeholder/300/200',
      carbonSaved: 450
    },
    {
      id: 3,
      title: 'Local Eco-resort Stay',
      location: 'Costa Rica',
      date: 'February 2024',
      image: '/api/placeholder/300/200',
      carbonSaved: 200
    }
  ];
  
  return (
    <div className="container-fluid p-0">
      <div className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body text-center py-4">
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="rounded-circle mb-3" 
                    style={{ width: '150px', height: '150px' }}
                  />
                  <h4>{userData.name}</h4>
                  <p className="text-muted">@{userData.username}</p>
                  <p className="mb-4">{userData.bio}</p>
                  <div className="d-flex justify-content-center mb-4">
                    <div className="px-3 border-end">
                      <h5>{userData.tripCount}</h5>
                      <small className="text-muted">Trips</small>
                    </div>
                    <div className="px-3 border-end">
                      <h5>{userData.followersCount}</h5>
                      <small className="text-muted">Followers</small>
                    </div>
                    <div className="px-3">
                      <h5>{userData.followingCount}</h5>
                      <small className="text-muted">Following</small>
                    </div>
                  </div>
                  <div className="d-grid">
                    <button className="btn btn-outline-success">Edit Profile</button>
                  </div>
                </div>
              </div>
              
              <div className="card shadow-sm mt-4">
                <div className="card-body">
                  <h5 className="card-title">Environmental Impact</h5>
                  <div className="text-center">
                    <div className="display-4 text-success fw-bold">{userData.carbonSaved}</div>
                    <p className="text-muted">kg CO₂ Saved</p>
                    <div className="progress my-3" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: '75%' }} 
                        aria-valuenow="75" 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <p className="mb-0 small">75% toward your yearly goal</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-8">
              <div className="card shadow-sm">
                <div className="card-body">
                  <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('profile')}
                      >
                        My Trips
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'badges' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('badges')}
                      >
                        Badges
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('saved')}
                      >
                        Saved Places
                      </button>
                    </li>
                  </ul>
                  
                  {activeTab === 'profile' && (
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="mb-0">Recent Trips</h5>
                        <button className="btn btn-success btn-sm">Plan New Trip</button>
                      </div>
                      
                      <div className="row g-4">
                        {trips.map(trip => (
                          <div key={trip.id} className="col-md-6 col-lg-4">
                            <div className="card h-100">
                              <img 
                                src={trip.image} 
                                className="card-img-top" 
                                alt={trip.title} 
                              />
                              <div className="card-body">
                                <h5 className="card-title">{trip.title}</h5>
                                <p className="card-text text-muted">
                                  <small>
                                    <i className="bi bi-geo-alt"></i> {trip.location}
                                  </small>
                                </p>
                                <p className="card-text">
                                  <small className="text-muted">{trip.date}</small>
                                </p>
                              </div>
                              <div className="card-footer bg-transparent">
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-success">
                                    <i className="bi bi-leaf"></i> {trip.carbonSaved} kg CO₂ saved
                                  </small>
                                  <button className="btn btn-sm btn-outline-secondary">
                                    <i className="bi bi-share"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-center mt-4">
                        <button className="btn btn-outline-success">View All Trips</button>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'badges' && (
                    <div>
                      <h5 className="mb-4">Earned Badges</h5>
                      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
                        <div className="col text-center">
                          <div className="bg-light rounded-circle p-4 mb-2 mx-auto" style={{ width: '120px', height: '120px' }}>
                            <div className="h-100 w-100 d-flex align-items-center justify-content-center">🚆</div>
                          </div>
                          <h6>Rail Explorer</h6>
                          <p className="small text-muted">Completed 5 train journeys</p>
                        </div>
                        <div className="col text-center">
                          <div className="bg-light rounded-circle p-4 mb-2 mx-auto" style={{ width: '120px', height: '120px' }}>
                            <div className="h-100 w-100 d-flex align-items-center justify-content-center">🌲</div>
                          </div>
                          <h6>Nature Lover</h6>
                          <p className="small text-muted">Visited 10 national parks</p>
                        </div>
                        <div className="col text-center">
                          <div className="bg-light rounded-circle p-4 mb-2 mx-auto" style={{ width: '120px', height: '120px' }}>
                            <div className="h-100 w-100 d-flex align-items-center justify-content-center">🚲</div>
                          </div>
                          <h6>Cyclist</h6>
                          <p className="small text-muted">Logged 200 km on bike</p>
                        </div>
                        <div className="col text-center">
                          <div className="bg-light rounded-circle p-4 mb-2 mx-auto" style={{ width: '120px', height: '120px' }}>
                            <div className="h-100 w-100 d-flex align-items-center justify-content-center">🏕️</div>
                          </div>
                          <h6>Happy Camper</h6>
                          <p className="small text-muted">Spent 14 nights camping</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'saved' && (
                    <div>
                      <h5 className="mb-4">Saved Places</h5>
                      <div className="list-group">
                        <a href="#" className="list-group-item list-group-item-action">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">Eco Lodge in Costa Rica</h6>
                            <small>2 days ago</small>
                          </div>
                          <p className="mb-1">Off-grid eco-lodge with sustainable practices and local cuisine.</p>
                          <small className="text-muted">San José, Costa Rica</small>
                        </a>
                        <a href="#" className="list-group-item list-group-item-action">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">Solar-powered Safari Camp</h6>
                            <small>1 week ago</small>
                          </div>
                          <p className="mb-1">Luxury sustainable safari experience with minimal environmental impact.</p>
                          <small className="text-muted">Serengeti, Tanzania</small>
                        </a>
                        <a href="#" className="list-group-item list-group-item-action">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">Zero-waste Restaurant</h6>
                            <small>2 weeks ago</small>
                          </div>
                          <p className="mb-1">Farm-to-table dining experience with zero waste policy.</p>
                          <small className="text-muted">Portland, Oregon</small>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-light py-3 text-center text-muted mt-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>© 2025 EcoTravel. All rights reserved.</div>
            <div>
              <a href="#" className="text-muted me-3">Privacy Policy</a>
              <a href="#" className="text-muted me-3">Terms of Service</a>
              <a href="#" className="text-muted">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;