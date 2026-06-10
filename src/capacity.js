// Calculate all nights for a booking
function getNights(startDate, nights) {
  const dates = [];
  const date = new Date(startDate);

  for (let i = 0; i < nights; i++) {
    const d = new Date(date);
    d.setDate(date.getDate() + i);
    dates.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
  }

  return dates;
}

// Check capacity + overlap (T1, T2)
export function checkCapacity(hutName, startDate, nights, partySize, bookings, huts) {
  const hut = huts.find(h => h.name.toLowerCase() === hutName.toLowerCase());
  if (!hut) return "Hut does not exist.";

  const nightsRequested = getNights(startDate, nights);

  // For each night, calculate total people already booked
  for (const night of nightsRequested) {
    let total = partySize; // include the new booking

    for (const b of bookings) {
      if (b.hut.toLowerCase() === hutName.toLowerCase()) {
        const bookedNights = getNights(b.date, b.nights);
        if (bookedNights.includes(night)) {
          total += b.partySize;
        }
      }
    }

    if (total > hut.capacity) {
      return `Capacity exceeded on ${night}. Hut capacity is ${hut.capacity}.`;
    }
  }

  return null; // no issues
}
