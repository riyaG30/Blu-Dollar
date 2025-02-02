import React, { useEffect, useState } from 'react';
import axios from 'axios';
import blueDollarsImage from './bluedollar1.jpg';
import peopleImage from './people.png';
import Cookies from 'js-cookie';
import Reservation from './Reservation'
// const Reservation = ({ reservation }) => (
//   <div className="bg-white p-4 rounded-lg shadow-md">
//     <div className="flex items-center mb-2">
//       <img
//         src={peopleImage}
//         alt={`${reservation.employeeName}'s profile`}
//         className="w-10 h-10 rounded-full mr-4"
//       />
//       <h3 className="text-lg font-semibold">{reservation.employeeName}</h3>
//     </div>
//     {reservation.reservations.map((res, index) => (
//       <div key={index} className="mt-2">
//         <p>Date: <span className="font-semibold">{new Date(res.date).toLocaleDateString()}</span></p>
//         <p>Seats Reserved: <span className="font-semibold">{res.seats.length}</span></p>
//         <p>Blue Dollars Charged: <span className="font-semibold">{res.seats.length * 5} BD</span></p>
//       </div>
//     ))}
//   </div>
// );

const Manager = () => {
  const [reservations, setReservations] = useState([]);
  const [managerData, setManagerData] = useState({
    managerName: '',
    totalBluDollarsCharged: 0,
    remainingBluDollars: 0,
  });
  const getToken = () => Cookies.get('token');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = getToken(); // Extract JWT from cookie
        const response = await axios.get('http://localhost:5500/api/manager/reservations', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        
        
        const { managerName, totalBluDollarsCharged, remainingBluDollars, employeesWithReservations } = response.data;
        console.log(managerName, totalBluDollarsCharged, remainingBluDollars, employeesWithReservations)
        setReservations(employeesWithReservations);
        setManagerData({
          managerName,
          totalBluDollarsCharged,
          remainingBluDollars,
        });
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blue-Reserve</h1>
        <h2 className="text-xl font-semibold">Manager Dashboard</h2>
        <div className="text-lg font-semibold flex items-center">
          <img src={blueDollarsImage} alt="Blue Dollars" className="h-6 mr-2" />
          {managerData.remainingBluDollars} Blue Dollars
        </div>
      </header>

      {/* Reservation Summary */}
      <div className="mb-8">
        <p className="text-black-600 font-bold">Table Reservations</p>
        <span className="text-gray-500">
          Total Blue Dollars Charged: <span className="font-semibold">{managerData.totalBluDollarsCharged} BD</span>
        </span>
      </div>

      {/* Reservation List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((reservation, index) => (
          <Reservation key={index} reservation={reservation}/>
        ))}
      </div>
    </div>
  );
};

export default Manager;
