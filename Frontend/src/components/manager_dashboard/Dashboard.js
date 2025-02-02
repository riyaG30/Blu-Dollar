import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate(); // Hook to navigate programmatically

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-2">Welcome, Sarah Johnson</h1>
            <p className="text-gray-600 mb-8">
                What would you like to do today?
            </p>
            <div className="flex space-x-4">
                {/* Reserve a Seat */}
                <div
                    onClick={() => navigate("/booking")} // Navigate to booking
                    className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg transition"
                >
                    <div className="text-blue-500 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                        Reserve a Seat
                    </h2>
                    <p className="text-gray-600">
                        Book workspace for yourself or team members
                    </p>
                </div>
                {/* Go to Dashboard */}
                <div
                    onClick={() => navigate("/manager")} // Navigate to manager
                    className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg transition"
                >
                    <div className="text-blue-500 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 10h18M3 6h18M3 14h18M3 18h18"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold mb-2">
                        Go to Dashboard
                    </h2>
                    <p className="text-gray-600">
                        View analytics and manage reservations
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
