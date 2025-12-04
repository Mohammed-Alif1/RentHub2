import React, { useEffect, useState } from 'react'
import { dummyMyBookingsData, assets } from '../assets/assets'
import Title from '../components/Title'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { motion } from 'motion/react'
// import Loader from '../components/Loader'

const MyBookings = () => {
  const { axios, token } = useAppContext()
  const [bookings, setBookings] = useState([])
  const currency = import.meta.env.VITE_CURRENCY

  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user-bookings')
      console.log("MyBookings Data:", data);
      if (data.success) {
        setBookings(data.bookings)
        console.log("Bookings State Set:", data.bookings);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      fetchMyBookings()
    }
  }, [token])

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto pb-12">

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Title
          title="My Bookings"
          subTitle="View and manage all your car bookings"
          align="left"
        />
      </motion.div>

      <div>
        {bookings.map((booking, index) => (
          <motion.div
            key={booking._id || index}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
          >
            {/* Car Image + Info */}
            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={booking.car.image}
                  alt=""
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              <p className="text-lg font-medium mt-2">
                {booking.car.brand} {booking.car.model}
              </p>
              <p className="text-gray-500">
                {booking.car.year} • {booking.car.category} • {booking.car.location}
              </p>
            </div>

            {/* Booking Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <p className="px-3 py-1.5 bg-light rounded">
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1 text-xs rounded-full ${booking.status === 'approved'
                      ? 'bg-green-400/15 text-green-600'
                      : booking.status === 'rejected'
                        ? 'bg-red-400/15 text-red-600'
                        : 'bg-yellow-400/15 text-yellow-600'
                    }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </p>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img src={assets.calendar_icon_colored} alt="" className="w-4 h-4 mt-1" />
                <div>
                  <p className="text-gray-500">Rental Period</p>
                  <p>
                    {booking.pickupDate.split('T')[0]} To {booking.returnDate.split('T')[0]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 mt-3">
                <img src={assets.location_icon_colored} alt="" className="w-4 h-4 mt-1" />
                <div>
                  <p className="text-gray-500">Pick-up Location</p>
                  <p>{booking.car.location}</p>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="md:col-span-1 flex flex-col justify-between gap-6">
              <div className="text-sm text-gray-500 text-right">
                <p>Total Price</p>
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-primary">
                  {currency}{booking.totalAmount}
                </h1>
                <p>Booked on {booking.createdAt.split('T')[0]}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default MyBookings
