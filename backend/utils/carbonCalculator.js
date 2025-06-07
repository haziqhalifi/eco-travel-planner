export function calculateCarbonFootprint({
  vehicleType,
  carUsage,
  electricityUsage,
  foodType,
  shortFlights,
  mediumFlights,
  longFlights
}) {
  // Vehicle emission factor (kg CO₂ per km)
  let vehicleFactor = 0;
  switch (vehicleType) {
    case 'Diesel Car': vehicleFactor = 0.27; break;
    case 'Petrol Car': vehicleFactor = 0.24; break;
    case 'Electric Car': vehicleFactor = 0.10; break;
    case 'Bicycle':
    case 'Scooter':
    case 'None': vehicleFactor = 0; break;
    default: vehicleFactor = 0.20;
  }

  // Food type emissions (kg CO₂ per day)
  const foodFactors = {
    Vegetarian: 3,
    'Non-Vegetarian': 7,
    Vegan: 2
  };

  // Flight emissions per hour (approximate)
  const flightFactors = {
    short: 80,
    medium: 90,
    long: 100
  };

  const carEmissions = Number(carUsage || 0) * vehicleFactor * 30;
  const electricityEmissions = Number(electricityUsage || 0) * 0.233; // kg CO₂/kWh
  const foodEmissions = (foodFactors[foodType] || 3) * 30;
  const flightEmissions =
    Number(shortFlights || 0) * flightFactors.short +
    Number(mediumFlights || 0) * flightFactors.medium +
    Number(longFlights || 0) * flightFactors.long;

  const total = carEmissions + electricityEmissions + foodEmissions + flightEmissions;
  return total.toFixed(0);
}
