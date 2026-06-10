// Validate tramper name (T6)
export function validateName(name) {
  if (!name || name.trim() === "") {
    return "Name cannot be empty.";
  }
  return null;
}

// Validate hut exists (T7)
export function validateHut(hutName, huts) {
  const exists = huts.some(h => h.name.toLowerCase() === hutName.toLowerCase());
  if (!exists) {
    return "Hut does not exist.";
  }
  return null;
}

// Validate nights (T4, T5)
export function validateNights(nights) {
  const num = Number(nights);
  if (isNaN(num) || !Number.isInteger(num)) {
    return "Nights must be a whole number.";
  }
  if (num <= 0) {
    return "Nights must be greater than zero.";
  }
  return null;
}

// Validate party size (T4, T5)
export function validatePartySize(size) {
  const num = Number(size);
  if (isNaN(num) || !Number.isInteger(num)) {
    return "Party size must be a whole number.";
  }
  if (num <= 0) {
    return "Party size must be greater than zero.";
  }
  return null;
}

// Validate arrival date (T3)
export function validateDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();

  if (isNaN(date.getTime())) {
    return "Invalid date format. Use YYYY-MM-DD.";
  }

  // Remove time for comparison
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date < today) {
    return "Arrival date cannot be in the past.";
  }

  return null;
}
