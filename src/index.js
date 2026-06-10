import { loadHuts, loadBookings } from "./datastore.js";

console.log("Hut Booking Manager starting...");

async function main() {
    const huts = await loadHuts();
    const bookings = await loadBookings();

    console.log("Loaded huts:", huts.length);
    console.log("Loaded bookings:", bookings.length);
}

main();

