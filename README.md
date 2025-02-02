Responsive Seat Reservation System

Overview

The Responsive Seat Reservation System is a web-based application built using the MERN stack that allows users to reserve seats in a cafeteria. Users can select floors, dates, times, and durations while viewing seat availability in real time. The system dynamically updates seat colors to indicate availability, reservation, or selection status.

Features

Role-based Access Control: Authentication using JWT.

Employee: Redirected to the booking page to reserve seats.

Manager: Redirected to the manager dashboard.

Manager Dashboard:

Displays assigned employees.

Managers have 100 Blue Dollars that decrease by 5 per reservation made by an employee.

Floor Selection: Users can choose between Ground, First, and Second floors.

Real-time Seat Layout: Displays available, reserved, and selected seats dynamically.

Time & Duration Selection: Users can pick a preferred time slot and duration for their reservation.

API Integration: Fetches seat availability and reservation status from the backend.

Reservation Management: Users can book seats and view their reservation history.

Responsive UI: Fully optimized for mobile, tablet, and desktop screens using Tailwind CSS.

Tech Stack

Frontend: React, Tailwind CSS

Backend: Node.js, Express.js, MongoDB

State Management: Context API

API Integration: Fetch API / Axios

Authentication: JSON Web Token (JWT)

Installation & Setup

Clone the repository:

git clone https://github.com/yourusername/seat-reservation-system.git

Navigate to the project directory:

cd seat-reservation-system

Install frontend and backend dependencies:

npm install
cd backend && npm install

Start the backend server:

cd backend
npm start

Start the frontend server:

cd frontend
npm start

Usage

Login using JWT authentication.

If logged in as an Employee:

Select a floor (Ground, First, or Second).

Pick a date, time, and duration for your reservation.

View available seats and make a selection.

Confirm your reservation.

Check reservation history to track your bookings.

If logged in as a Manager:

Access the dashboard to monitor assigned employees.

Track reservations and Blue Dollar balance.

Screenshots

(Add relevant screenshots showcasing the UI)

Future Enhancements

Enhanced User Authentication: Multi-factor authentication.

Admin Panel: Manage reservations and seat layouts.

Notifications: Email or SMS alerts for reservations.

Payment Integration: Option for premium seat bookings.

Analytics Dashboard: Visual reports for seat usage and reservation patterns.

Contributing

Feel free to fork the repository and submit pull requests. Contributions are welcome!

License

This project is licensed under the MIT License.
