import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { MdOutlineChair } from "react-icons/md";
import ReservationHistory from "./ReservationHistory";

import Navbar from "./Navbar";

const API_BASE_URL = "http://localhost:5500"; // Replace with your API base URL
const getToken = () => Cookies.get("token");

const BookingPage = () => {
    const floorMapping = {
        "Floor 1": "A",
        "Floor 2": "B",
        "Floor 3": "C",
    };

    const [floor, setFloor] = useState("Floor 1");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [duration, setDuration] = useState(1);
    const [reservations, setReservations] = useState([]);
    const [seats, setSeats] = useState(
        Array(8)
            .fill(0)
            .map((_, tableIndex) => ({
                table: tableIndex + 1,
                chairs: Array(6)
                    .fill(0)
                    .map((_, chairIndex) => ({
                        number: `${floorMapping[floor] || "A"}${
                            tableIndex * 6 + chairIndex + 1
                        }`,
                        reserved: Math.random() > 0.8,
                    })),
            }))
    );
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [message, setMessage] = useState("");
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        // Set initial date and time
        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0];
        const formattedTime = now
            .toTimeString()
            .split(":")
            .slice(0, 2)
            .join(":");
        setDate(formattedDate);
        setTime(formattedTime);

        handleGetReservations();
    }, []);

    const handleGetReservations = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/api/reservations`,
                {
                    headers: { authorization: `Bearer ${getToken()}` },
                }
            );

            setReservations(response.data);
        } catch (error) {
            console.log("Error fetching reservations.");
        }
    };

    const handleReserveSeat = async () => {
        if (!selectedSeat) {
            alert("Please select a seat before reserving.");
            return;
        }

        if (!time || !date) {
            alert("Please fill out the time and date.");
            return;
        }

        const body = {
            seats: [selectedSeat],
            floor,
            date,
            timeSlot: `${time}-${
                parseInt(time.split(":"[0])) + parseInt(duration)
            }:00`,
        };

        try {
            const updatedSeats = seats.map((table) => ({
                ...table,
                chairs: table.chairs.map((chair) =>
                    chair.number === selectedSeat
                        ? { ...chair, reserved: true }
                        : chair
                ),
            }));
            const response = await axios.post(
                `${API_BASE_URL}/api/reserve`,
                body,
                {
                    headers: { authorization: `Bearer ${getToken()}` },
                }
            );

            await handleGetReservations();

            setSeats(updatedSeats);
            setShowModal(true); // Show the modal
            setSelectedSeat(null);
            alert(
                response.data.message ||
                    `Seat ${selectedSeat} reserved successfully.`
            );
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Error reserving seats."
            );
            alert(message);
        }
    };
    const handleBackToDashboard = () => {
        console.log("Navigating to dashboard...");
        setShowModal(false);
    };
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">Reservation Form</h2>
                    <div className="flex gap-4 items-end w-full">
                        <div className="flex flex-col flex-grow">
                            <label className="block mb-1 font-medium">
                                Floor
                            </label>
                            <select
                                className="border px-3 py-2 rounded-md w-full"
                                value={floor}
                                onChange={(e) => setFloor(e.target.value)}
                            >
                                <option value="Floor 1">Floor 1</option>
                                <option value="Floor 2">Floor 2</option>
                                <option value="Floor 3">Floor 3</option>
                            </select>
                        </div>

                        <div className="flex flex-col flex-grow">
                            <label className="block mb-1 font-medium">
                                Date
                            </label>
                            <input
                                type="date"
                                className="border px-3 py-2 rounded-md w-full"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col flex-grow">
                            <label className="block mb-1 font-medium">
                                Time
                            </label>
                            <input
                                type="time"
                                className="border px-3 py-2 rounded-md w-full"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col flex-grow">
                            <label className="block mb-1 font-medium">
                                Duration (hours)
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="border px-3 py-2 rounded-md w-ful"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        Select Your Seat for Floor {floor}
                    </h2>
                    <div className="grid grid-cols-4 gap-8 justify-center">
                        {seats.map((table) => (
                            <div
                                key={table.table}
                                className="relative w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center"
                            >
                                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center font-bold text-center">
                                    Table {table.table}
                                </div>
                                {table.chairs.map((chair, index) => {
                                    const angle =
                                        (360 / table.chairs.length) * index;
                                    return (
                                        <button
                                            key={chair.number}
                                            aria-label={`Seat ${
                                                chair.number
                                            }, ${
                                                chair.reserved
                                                    ? "reserved"
                                                    : "available"
                                            }`}
                                            onClick={() => {
                                                if (!chair.reserved) {
                                                    setSelectedSeat(
                                                        chair.number
                                                    );
                                                }
                                            }}
                                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl ${
                                                chair.reserved
                                                    ? "text-red-500 cursor-not-allowed"
                                                    : selectedSeat ===
                                                      chair.number
                                                    ? "text-blue-500"
                                                    : "text-gray-400"
                                            }`}
                                            style={{
                                                top: `${
                                                    50 +
                                                    40 *
                                                        Math.sin(
                                                            (angle * Math.PI) /
                                                                180
                                                        )
                                                }%`,
                                                left: `${
                                                    50 +
                                                    40 *
                                                        Math.cos(
                                                            (angle * Math.PI) /
                                                                180
                                                        )
                                                }%`,
                                                zIndex: chair.reserved ? 1 : 2,
                                            }}
                                            disabled={chair.reserved}
                                        >
                                            <MdOutlineChair />
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                    {/* Legend */}
                    <div className="mt-6 flex justify-center space-x-6">
                        <span className="flex items-center space-x-2">
                            <MdOutlineChair className="text-gray-400" />
                            <span>Available</span>
                        </span>
                        <span className="flex items-center space-x-2">
                            <MdOutlineChair className="text-red-500" />
                            <span>Reserved</span>
                        </span>
                        <span className="flex items-center space-x-2">
                            <MdOutlineChair className="text-blue-500" />
                            <span>Selected</span>
                        </span>
                    </div>

                    {/* Reserve Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleReserveSeat}
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Reserve Seat
                        </button>
                    </div>
                    {/* Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white rounded-md p-6 w-96 text-center space-y-4 shadow-lg">
                                <h3 className="text-lg font-semibold">
                                    Thank you for your reservation!
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Your seat reservation is confirmed. Please
                                    arrive 5 minutes before the reservation.
                                    Enjoy your experience.
                                </p>
                                <div className="bg-red-100 text-red-500 px-4 py-2 rounded-md text-sm">
                                    Reservation ID:{" "}
                                    <strong>#{89415424585}</strong>
                                </div>
                                <button
                                    onClick={handleBackToDashboard}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ReservationHistory reservations={reservations} />
        </div>
    );
};

export default BookingPage;
