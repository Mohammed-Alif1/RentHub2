import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const ManageBookings = () => {
    const { currency, axios, user } = useAppContext();
    const [bookings, setBookings] = useState([]);

    const fetchOwnerBookings = async () => {
        try {
            const { data } = await axios.get('/api/bookings/owner-bookings');
            console.log("Owner Bookings Data:", data);
            if (data.success) {
                setBookings(data.bookings);
                console.log("Owner Bookings Set:", data.bookings);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to fetch bookings");
        }
    };

    const changeBookingStatus = async (id, newStatus) => {
        console.log("Changing status for booking:", id, "to:", newStatus);
        try {
            const { data } = await axios.put(`/api/bookings/change-status/${id}`, { status: newStatus });
            console.log("Status change response:", data);
            if (data.success) {
                toast.success(data.message);
                fetchOwnerBookings();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log("Status change error:", error);
            toast.error(error?.response?.data?.message || "Failed to update status");
        }
    };

    useEffect(() => {
        // Wait for user to be loaded before fetching bookings
        // User is set immediately in Login.jsx, so this ensures auth is ready
        if (user) {
            fetchOwnerBookings();
        }
    }, [user]);

    return (
        <div className='px-4 pt-10 md:px-10 w-full'>
            <Title
                title="Manage Bookings"
                subTitle="View all bookings made by customers, update their status, or remove them if necessary."
            />

            <div className='max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
                <table className='w-full border-collapse text-left text-sm text-gray-600'>
                    <thead className='text-gray-500'>
                        <tr>
                            <th className="p-3 font-medium">Car</th>
                            <th className="p-3 font-medium max-md:hidden">User</th>
                            <th className="p-3 font-medium">Price</th>
                            <th className="p-3 font-medium max-md:hidden">Status</th>
                            <th className="p-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={booking._id || index} className='border-t border-borderColor'>
                                {/* Car Info */}
                                <td className='p-3 flex items-center gap-3'>
                                    <img
                                        src={booking.car.image}
                                        alt=""
                                        className='h-12 w-12 aspect-square rounded-md object-cover'
                                    />
                                    <div className='max-md:hidden'>
                                        <p className='font-medium'>{booking.car.brand} {booking.car.model}</p>
                                        <p className='text-xs text-gray-500'>
                                            {booking.car.seating_capacity} • {booking.car.transmission}
                                        </p>
                                    </div>
                                </td>

                                {/* User */}
                                <td className='p-3 max-md:hidden'>{booking.user?.name || 'Unknown User'}</td>

                                {/* Price */}
                                <td className='p-3'>
                                    {currency}{booking.totalAmount}
                                </td>

                                {/* Status */}
                                <td className='p-3 max-md:hidden'>
                                    {booking.status === 'pending' ? (
                                        <div className="flex gap-2">
                                            <button
                                                className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition"
                                                onClick={() => changeBookingStatus(booking._id, 'approved')}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition"
                                                onClick={() => changeBookingStatus(booking._id, 'rejected')}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-xs ${booking.status === 'approved'
                                            ? 'bg-green-100 text-green-500'
                                            : 'bg-red-100 text-red-500'
                                            }`}>
                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                        </span>
                                    )}
                                </td>

                                {/* Actions */}
                                <td className='flex items-center gap-4 p-3'>
                                    {/* View / Hide icon */}
                                    <img
                                        src={assets.eye_icon}
                                        alt="view"
                                        className='cursor-pointer h-8 w-8'
                                    />
                                    {/* Delete icon */}
                                    <img
                                        src={assets.delete_icon}
                                        alt="delete"
                                        className='cursor-pointer h-8 w-8'
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageBookings;
