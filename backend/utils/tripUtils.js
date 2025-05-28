export const filterByTags = (trips, tags) => {
  const tagArray = tags.split(',').map(
      (tag) => tag.trim().toLowerCase()
  );

  return trips.filter((trip) => {
    tagArray.some((tag) =>
        trip.tags.some((tripTag) => tripTag.toLowerCase().includes(tag)));
  });
};

export const filterBySearch = (trips, searchTerm) => {
  const search = searchTerm.toLowerCase();
  return trips.filter((trip) => {
    trip.title.toLowerCase().includes(search) ||
    trip.location.toLowerCase().includes(search) ||
    trip.description.toLowerCase().includes(search);
  });
}