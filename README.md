# sdv503-a3-hut-booking-767573
SDV503-A3
Hut Booking Manager
This project is a simple command‑line booking system for three huts on the Milford Track. Users can add bookings, cancel bookings, view all bookings, and generate a summary report. The program loads hut and booking data from JSON files and saves any changes back to disk.

The purpose of the project is to practise JavaScript modules, file handling, validation, and building a menu‑driven CLI.

How to Run
Requirements
Node.js (version 18+ recommended)

Steps
1.Open a terminal in the project folder
2.Run the program:
node src/index.js
The main menu will appear in the terminal.

Features
1.Add Booking
-Enter tramper name
-Select a hut from a menu
-Enter arrival date, nights, and party size
-System validates input and checks hut capacity

2.Cancel Booking
-Shows all bookings
-User enters a booking ID to remove it

3.View Bookings
-Lists all current bookings with key details

4.Summary Report
-Total bookings
-Total trampers
-Bookings per hut
-Nights booked per hut

5.Exit

Project Structure
src/
  index.js
  datastore.js
  validation.js
  capacity.js

data/
  huts.json
  bookings.json

Data Files
-huts.json
Stores hut names and capacities.
-bookings.json
Starts empty and is updated automatically by the program.