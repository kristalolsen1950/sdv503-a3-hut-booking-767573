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

// Create readline interface for CLI input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Safe screen clear for all terminals
function clearScreen() {
  process.stdout.write("\u001b[2J\u001b[0;0H");
}

// Display the main menu
function showMenu() {
  clearScreen();
  console.log(""); // <-- FIX: forces terminal to scroll
  console.log("=== Hut Booking Manager ===");
  console.log("1. Add Booking");
  console.log("2. Cancel Booking");
  console.log("3. View Bookings");
  console.log("4. Summary Report");
  console.log("5. Search Bookings by Name");
  console.log("6. Exit");
  console.log("===========================");
}

// Pause before returning to menu
function pauseAndReturn() {
  rl.question("\nPress Enter to return to the menu...", () => {
    mainMenu();
  });
}

// Display an error message and return to menu
function showError(msg) {
  console.log("\nError:", msg);
  return pauseAndReturn();
}

// Add a new booking
function addBookingFlow() {
  clearScreen();
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

            // Check capacity and overlapping bookings
            const capError = checkCapacity(
              hutName,
              dateStr,
              nights,
              partySize,
              bookings,
              huts
            );

            if (capError) return showError(capError);

            // Create and save the new booking
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

// Cancel an existing booking
function cancelBookingFlow() {
  clearScreen();
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

// Display all bookings
function viewBookingsFlow() {
  clearScreen();
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

// NEW: Search bookings by name (case-insensitive)
function searchBookingsFlow() {
  clearScreen();
  console.log("=== Search Bookings by Name ===");

  if (bookings.length === 0) {
    console.log("There are no bookings to search.");
    return pauseAndReturn();
  }

  rl.question("Enter name to search: ", (name) => {
    const searchTerm = name.trim().toLowerCase();

    const results = bookings.filter((b) =>
      b.name.toLowerCase().includes(searchTerm)
    );

    console.log(`\nFound ${results.length} matching bookings:\n`);

    results.forEach((b) =>
      console.log(
        `ID: ${b.id} | ${b.name} | ${b.hut} | ${b.date} (${b.nights} nights, ${b.partySize} people)`
      )
    );

    return pauseAndReturn();
  });
}

// Generate a summary report
function summaryReportFlow() {
  clearScreen();
  console.log("=== Summary Report ===");

  if (bookings.length === 0) {
    console.log("There are no bookings to summarise.");
    return pauseAndReturn();
  }

  const totalBookings = bookings.length;
  const totalTrampers = bookings.reduce((sum, b) => sum + b.partySize, 0);

  const hutCounts = {};
  const hutNights = {};

  huts.forEach(h => {
    hutCounts[h.name] = 0;
    hutNights[h.name] = 0;
  });

  bookings.forEach(b => {
    hutCounts[b.hut] += 1;
    hutNights[b.hut] += b.nights;
  });

  console.log(`\nTotal bookings: ${totalBookings}`);
  console.log(`Total trampers: ${totalTrampers}`);

  console.log("\nBookings per hut:");
  Object.entries(hutCounts).forEach(([hut, count]) => {
    console.log(`- ${hut}: ${count}`);
  });

  console.log("\nNights booked per hut:");
  Object.entries(hutNights).forEach(([hut, nights]) => {
    console.log(`- ${hut}: ${nights} nights`);
  });

  return pauseAndReturn();
}

// Main menu controller
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
        return summaryReportFlow();
      case "5":
        return searchBookingsFlow();
      case "6":
        console.log("Goodbye!");
        rl.close();
        return;
      default:
        console.log("Invalid option. Try again.");
        return pauseAndReturn();
    }
  });
}

// Load data and start the program
async function start() {
  console.log("Hut Booking Manager starting...");

  huts = await loadHuts();
  bookings = await loadBookings();

  console.log(`Loaded huts: ${huts.length}`);
  console.log(`Loaded bookings: ${bookings.length}`);

  mainMenu();
}

start();