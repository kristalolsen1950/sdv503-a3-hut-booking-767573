import { readFile, writeFile } from "fs/promises";

export async function loadHuts() {
    try {
        const data = await readFile("./data/huts.json", "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.log("Warning: huts.json missing or unreadable. Starting with empty huts list.");
        return [];
    }
}

export async function loadBookings() {
    try {
        const data = await readFile("./data/bookings.json", "utf-8");
        return JSON.parse(data);
    } catch (err) {
        console.log("Warning: bookings.json missing or unreadable. Starting with empty bookings list.");
        return [];
    }
}

export async function saveBookings(bookings) {
    try {
        const json = JSON.stringify(bookings, null, 2);
        await writeFile("./data/bookings.json", json, "utf-8");
    } catch (err) {
        console.log("Error: could not save bookings.json");
    }
}

export function generateBookingId(bookings) {
    if (bookings.length === 0) return 1;
    const ids = bookings.map(b => b.id);
    return Math.max(...ids) + 1;
}
