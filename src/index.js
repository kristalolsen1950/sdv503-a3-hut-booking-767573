import readline from "readline";
import { loadHuts, loadBookings } from "./datastore.js";

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

// Main menu loop
function mainMenu() {
  showMenu();

  rl.question("Choose an option: ", (choice) => {
    switch (choice.trim()) {
      case "1":
        console.log("Add Booking selected (feature coming soon)");
        return pauseAndReturn();
      case "2":
        console.log("Cancel Booking selected (feature coming soon)");
        return pauseAndReturn();
      case "3":
        console.log("View Bookings selected (feature coming soon)");
        return pauseAndReturn();
      case "4":
        console.log("Summary Report selected (feature coming soon)");
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

// Helper to pause before returning to menu
function pauseAndReturn() {
  rl.question("\nPress Enter to return to the menu...", () => {
    mainMenu();
  });
}

// Startup
async function start() {
  console.log("Hut Booking Manager starting...");

  huts = await loadHuts();
  bookings = await loadBookings();

  console.log(`Loaded huts: ${huts.length}`);
  console.log(`Loaded bookings: ${bookings.length}`);

  // Start menu loop
  mainMenu();
}

start();


