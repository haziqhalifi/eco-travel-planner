const tripsData = [
  {
    id: 1,
    title: "Switzerland Trip Rundown",
    startDate: "2024-08-21",
    endDate: "2024-08-29",
    location: "Switzerland",
    image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=1000",
    description: "Explore the beauty of the Swiss Alps and charming cities.",
    days: [
      {
        date: "2024-08-21",
        activities: [
          {
            time: "15:00",
            place: "Arrive at Zurich International Airport",
            icon: "plane",
            details: "",
            imageUrl: "https://media.istockphoto.com/id/1308631254/photo/zurich-international-airport.jpg?s=612x612&w=0&k=20&c=u8BDh5zwBk3LGmRFl8sHMKYmkbRHlN0XqVV5yMNPWyE="
          },
          {
            time: "16:00",
            place: "Elfrentes Roasting",
            icon: "coffee",
            details: "Open now - 23:00, 4.7 from 2735 reviews"
          },
          {
            time: "17:00",
            place: "Spend the day exploring Zurich",
            icon: "compass",
            details: ""
          },
          {
            time: "19:00",
            place: "Elmira fine dining",
            icon: "food",
            details: ""
          },
          {
            time: "19:45",
            place: "BVLGARI Hotel",
            icon: "hotel",
            details: ""
          }
        ]
      },
      {
        date: "2024-08-22",
        activities: [
          {
            time: "09:00",
            place: "Elfrentes Roasting",
            icon: "coffee",
            details: ""
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Italy Adventure",
    startDate: "2024-09-15",
    endDate: "2024-09-25",
    location: "Italy",
    image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000",
    description: "Experience the rich history and cuisine of Italy.",
    days: [
      {
        date: "2024-09-15",
        activities: [
          {
            time: "10:30",
            place: "Arrive at Rome Fiumicino Airport",
            icon: "plane",
            details: "",
            imageUrl: "https://images.unsplash.com/photo-1525874684015-58379d421a52?q=80&w=1000"
          },
          {
            time: "13:00",
            place: "Check in at Hotel Roma",
            icon: "hotel",
            details: "4-star accommodation in the heart of Rome"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Japan Discovery",
    startDate: "2024-10-10",
    endDate: "2024-10-22",
    location: "Japan",
    image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1000",
    description: "Immerse yourself in the unique blend of tradition and modernity.",
    days: [
      {
        date: "2024-10-10",
        activities: [
          {
            time: "14:00",
            place: "Arrive at Tokyo Narita Airport",
            icon: "plane",
            details: "",
            imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000"
          }
        ]
      }
    ]
  }
];

export default tripsData;