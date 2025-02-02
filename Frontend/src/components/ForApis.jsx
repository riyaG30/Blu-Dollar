import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:5500';

axios.defaults.withCredentials = true;

const ForApis = () => {
  const [message, setMessage] = useState('');
  const [responseData, setResponseData] = useState(null);

  const getToken = () => Cookies.get('token');




  





  const handleReserveSeats = async () => {
    const sampleBody = {
      seats: ["A1", "A2"],
      floor: "Floor 1",
      date: "2025-01-30",
      timeSlot: "09:00-11:00",
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/reserve`,
        sampleBody,
        {
          headers: { authorization: `Bearer ${getToken()}` },
        }
      );
      setMessage(response.data.message);
      setResponseData(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error reserving seats.');
    }
  };

  const handleGetReservations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reservations`, {
        headers: { authorization: `Bearer ${getToken()}` },
      });
      
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching reservations.');
    }
  };

  const handleGetAvailableSeats = async () => {
    const floorName = "Floor 1";

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/floor/${floorName}/available-seats`,
        {
          headers: { authorization: `Bearer ${getToken()}` },
        }
      );
      setMessage("Fetched available seats successfully.");
      setResponseData(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching available seats.');
    }
  };

  const handleGetManagerReservations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/manager/reservations`, {
        headers: { authorization: `Bearer ${getToken()}` },
      });
      setMessage("Fetched manager's reservations successfully.");
      setResponseData(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching manager reservations.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">API Tester</h1>
      <div className="space-y-4">
        <button onClick={handleReserveSeats} className="px-4 py-2 bg-blue-500 text-white rounded">
          Reserve Seats
        </button>
        <button onClick={handleGetReservations} className="px-4 py-2 bg-green-500 text-white rounded">
          Get My Reservations
        </button>
        <button onClick={handleGetAvailableSeats} className="px-4 py-2 bg-purple-500 text-white rounded">
          Get Available Seats
        </button>
        <button onClick={handleGetManagerReservations} className="px-4 py-2 bg-red-500 text-white rounded">
          Get Manager Reservations
        </button>
      </div>
      <div className="mt-4">
        {message && <p className="text-red-500">{message}</p>}
        {responseData && (
          <pre className="bg-gray-100 p-2 rounded mt-2">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default ForApis;
