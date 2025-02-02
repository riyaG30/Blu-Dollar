import React, { useState } from "react";
import { MdOutlineChair } from "react-icons/md";
import Navbar from "./Navbar";

const BookingPage = () => {
    const floorMapping = {
        "Floor 1": "A",
        "Floor 2": "B",
        "Floor 3": "C",
    };

    const [floor, setFloor] = useState("Floor 1");
    const [showModal, setShowModal] = useState(false);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState(1);
    const [reservationId, setReservationId] = useState(null); // Added state for reservation ID
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

    const handleReserveSeats = async () => {
        const requestBody = {
            seats: [selectedSeat],
            floor,
            date,
            timeSlot: `${time} - ${duration}hr`,
        };

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/reserve`,
                requestBody,
                {
                    headers: { authorization: `Bearer ${getToken()}` },
                }
            );
            setReservationId(response.data.reservationId); // Set reservation ID from API
            setShowModal(true); // Show modal after reservation
        } catch (error) {
            alert(error.response?.data?.message || "Error reserving seats.");
        }
    };

    const handleReserveSeat = async () => {
        if (!selectedSeat) {
            alert("Please select a seat before reserving.");
            return;
        }

        const updatedSeats = seats.map((table) => ({
            ...table,
            chairs: table.chairs.map((chair) =>
                chair.number === selectedSeat
                    ? { ...chair, reserved: true }
                    : chair
            ),
        }));
        setSeats(updatedSeats);
        await handleReserveSeats();
        setSelectedSeat(null);
    };

    const handleBackToDashboard = () => {
        console.log("Navigating to dashboard...");
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Reservation Form
                </h2>
                <div className="space-y-4">
                    {/* Form Inputs */}
                    {/* Floor */}
                    <select
                        className="w-full p-2 mt-1 border rounded-md"
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                    >
                        <option value="Floor 1">Floor 1</option>
                        <option value="Floor 2">Floor 2</option>
                        <option value="Floor 3">Floor 3</option>
                    </select>
                    {/* Other inputs... */}
                </div>

                <h2 className="text-2xl font-bold mt-6 mb-4 text-center">
                    Select Your Seat for Floor {floor}
                </h2>
                <div className="grid grid-cols-4 gap-8">
                    {seats.map((table) => (
                        <div
                            key={table.table}
                            className="relative w-48 h-48 bg-gray-200 rounded-full"
                        >
                            <div className="absolute-center font-bold">
                                Table {table.table}
                            </div>
                            {table.chairs.map((chair, index) => (
                                <button
                                    key={chair.number}
                                    className={`absolute ${
                                        chair.reserved
                                            ? "text-red-500"
                                            : selectedSeat === chair.number
                                            ? "text-blue-500"
                                            : "text-gray-400"
                                    }`}
                                    style={
                                        {
                                            /* styles omitted for brevity */
                                        }
                                    }
                                    disabled={chair.reserved}
                                    onClick={() =>
                                        setSelectedSeat(chair.number)
                                    }
                                >
                                    <MdOutlineChair />
                                </button>
                            ))}
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
                                arrive 5 minutes before the reservation. Enjoy
                                your experience.
                            </p>
                            <div className="bg-red-100 text-red-500 px-4 py-2 rounded-md text-sm">
                                Reservation ID:{" "}
                                <strong>#{reservationId}</strong>
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
    );
};

export default BookingPage;
