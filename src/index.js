import readline from "readline";
import { loadHuts, loadBookings, saveBookings } from "./datastore.js";

import {
  validateName,
  validateNights,
  validatePartySize,
  validateDate
} from "./validation.js";

import { checkCapacity } from "./capacity.js";

let huts = [];
let bookings = [];

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Clear screen + show menu
function showMenu() {
  console.clear();
  console.log("=== Hut Booking Manager ===");
  console.log("1. Add Booking");
  console.log("2. Cancel Booking");
  console.log("3. View Bookings");
  console.log("4. Summary Report");
  console.log("5. Exit");
  console.log("===========================");
}

// Pause before returning to menu
function pauseAndReturn() {
  rl.question("\nPress Enter to return to the menu...", () => {
    mainMenu();
  });
}

// Error helper
function showError(msg) {
  console.log("\nError:", msg);
  return pauseAndReturn();
}

// ⭐ STEP 6 — Add Booking Flow (with hut menu)
function addBookingFlow() {
  console.clear();
  console.log("=== Add Booking ===");

  rl.question("Tramper name: ", (name) => {
    const nameError = validateName(name);
    if (nameError) return showError(nameError);

    // Hut selection menu
    console.log("\nSelect a hut:");
    huts.forEach((h, i) => {
      console.log(`${i + 1}. ${h.name}`);
    });

    rl.question("Choose hut (1-3): ", (hutChoice) => {
      const index = Number(hutChoice) - 1;

      if (isNaN(index) || index < 0 || index >= huts.length) {
        return showError("Invalid hut selection.");
      }

      const hutName = huts[index].name;

      rl.question("Arrival date (YYYY-MM-DD): ", (dateStr) => {
        const dateError = validateDate(dateStr);
        if (dateError) return showError(dateError);

        rl.question("Nights: ", (nightsStr) => {
          const nightsError = validateNights(nightsStr);
          if (nightsError) return showError(nightsError);

          rl.question("Party size: ", (sizeStr) => {
            const sizeError = validatePartySize(sizeStr);
            if (sizeError) return showError(sizeError);

            const nights = Number(nightsStr);
            const partySize = Number(sizeStr);

            // Capacity + overlap check
            const capError = checkCapacity(
              hutName,
              dateStr,
              nights,
              partySize,
              bookings,
              huts
            );

            if (capError) return showError(capError);

            // Create booking object
            const newBooking = {
              id: Date.now().toString(),
              name,
              hut: hutName,
              date: dateStr,
              nights,
              partySize
            };

            bookings.push(newBooking);
            saveBookings(bookings);

            console.log("\nBooking added successfully!");
            console.log(`Booking ID: ${newBooking.id}`);

            return pauseAndReturn();
          });
        });
      });
    });
  });
}

// ⭐ STEP 7 — Cancel Booking Flow
function cancelBookingFlow() {
  console.clear();
  console.log("=== Cancel Booking ===");

  if (bookings.length === 0) {
    console.log("There are no bookings to cancel.");
    return pauseAndReturn();
  }

  console.log("\nCurrent bookings:");
  bookings.forEach((b, i) => {
    console.log(
      `${i + 1}. ID: ${b.id} | ${b.name} | ${b.hut} | ${b.date} (${b.nights} nights, ${b.partySize} people)`
    );
  });

  rl.question("\nEnter the Booking ID to cancel: ", (id) => {
    const index = bookings.findIndex((b) => b.id === id.trim());

    if (index === -1) {
      return showError("Booking ID not found.");
    }

    const removed = bookings.splice(index, 1)[0];
    saveBookings(bookings);

    console.log(`\nBooking for ${removed.name} at ${removed.hut} has been cancelled.`);
    return pauseAndReturn();
  });
}

// ⭐ STEP 8 — View Bookings Flow
function viewBookingsFlow() {
  console.clear();
  console.log("=== View Bookings ===");

  if (bookings.length === 0) {
    console.log("There are no bookings.");
    return pauseAndReturn();
  }

  console.log("\nCurrent bookings:");
  bookings.forEach((b, i) => {
    console.log(
      `${i + 1}. ID: ${b.id} | ${b.name} | ${b.hut} | ${b.date} (${b.nights} nights, ${b.partySize} people)`
    );
  });

  return pauseAndReturn();
}

// Main menu loop
function mainMenu() {
  showMenu();

  rl.question("Choose an option: ", (choice) => {
    switch (choice.trim()) {
      case "1":
        return addBookingFlow();
      case "2":
        return cancelBookingFlow();
      case "3":
        return viewBookingsFlow();
      case "4":
        console.log("Summary Report selected (coming soon)");
        return pauseAndReturn();
      case "5":
        console.log("Goodbye!");
        rl.close();
        return;
      default:
        console.log("Invalid option. Try again.");
        return pauseAndReturn();
    }
  });
}

// Startup
async function start() {
  console.log("Hut Booking Manager starting...");

  huts = await loadHuts();
  bookings = await loadBookings();

  console.log(`Loaded huts: ${huts.length}`);
  console.log(`Loaded bookings: ${bookings.length}`);

  mainMenu();
}

start();
