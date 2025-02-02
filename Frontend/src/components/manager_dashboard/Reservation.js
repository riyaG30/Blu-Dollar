import React from 'react';

const Reservation = ({ reservation }) => {
    console.log("data here", reservation.reservations);  // Log the reservations array

    const employeeMapping = {
        '679639bf14416fd47375b6a9': 'Diana Reed',
        '679639bf14416fd47375b6a8': 'Chris Doe',
        '679639bf14416fd47375b6aa': 'Evan Short',
        '679639bf14416fd47375b6ab': 'Fiona Glenn',
    };

    return (
        <div>
            {reservation.reservations.map((reservation) => (
                <div key={reservation.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold">
                            {employeeMapping[reservation.employee] || 'Unknown Employee'}
                        </h3>
                    </div>
                    <p className="text-gray-500">Floor: {reservation.floor}</p>
                    <p className="mt-2">
                        Seat Number:{" "}
                        <span className="font-semibold">{reservation.seatNumber}</span>
                    </p>
                    <p>
                        Date: <span className="font-semibold">{reservation.date.slice(0, 10)}</span>
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Reservation;
