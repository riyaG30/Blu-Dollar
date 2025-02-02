import React from "react";

const ReservationHistory = ({ reservations }) => {
    console.log(reservations.reservations)
    const temp = reservations.reservations
    console.log("getting temp" + temp)
    if (!temp){
        return (
            <></>
        )
    }
    return (
        <div>
            <h2 className="text-xl font-bold mb-4">My Reservations</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Date</th>
                        <th className="border px-4 py-2">Time</th>
                        <th className="border px-4 py-2">Floor</th>
                        <th className="border px-4 py-2">Seat No.</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {reservations.reservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td className="border px-4 py-2">
                                {reservation.date.slice(0, 10)}
                            </td>
                            <td className="border px-4 py-2">
                                {reservation.timeSlot}
                            </td>
                            <td className="border px-4 py-2">
                                {reservation.floor}
                            </td>
                            <td className="border px-4 py-2">
                                {reservation.seatNumber}
                            </td>
                        
                            
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReservationHistory;
