import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { motion } from 'motion/react'

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cars, axios, pickupDate, returnDate, setPickupDate, setReturnDate, token, setShowLogin } = useAppContext()
  const [car, setCar] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Book Now clicked");

    if (!token) {
      console.log("No token found");
      toast.error("Please login to book a car");
      setShowLogin(true);
      return;
    }

    if (!pickupDate || !returnDate) {
      console.log("Dates missing");
      toast.error("Please select both pickup and return dates");
      return;
    }

    try {
      console.log("Sending booking request...");
      const { data } = await axios.post("/api/user/reservation", {
        carId: id,
        pickupDate,
        returnDate,
      })
      console.log("Response received:", data);
      if (data.success) {
        toast.success(data.message)
        navigate("/my-bookings")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error booking car:", error?.response?.data || error.message)
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    const foundCar = cars.find(car => car._id === id);
    setCar(foundCar)
  }, [cars, id])

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16 pb-20'>

      {/* Back Button */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ x: -5 }}
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'
      >
        <img
          src={assets.arrow_icon}
          alt="back"
          className='rotate-180 opacity-65'
        />
        Back to all cars
      </motion.button>

      {/* Layout Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>

        {/* Left Section */}
        <div className='lg:col-span-2'>

          {/* Car Image */}
          <motion.img
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            src={car.image}
            alt=""
            className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'
          />

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className='space-y-6'
          >

            {/* Title Section */}
            <div>
              <h1 className='text-3xl font-bold'>
                {car.brand} {car.model}
              </h1>
              <p className='text-gray-500 text-lg'>
                {car.category} • {car.year}
              </p>
            </div>

            <hr className='border-borderColor my-6' />

            {/* Specs Grid */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }, index) => (
                <motion.div
                  key={text}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className='flex flex-col items-center bg-light p-4 rounded-lg'
                >
                  <img src={icon} alt="" className='h-5 mb-2' />
                  {text}
                </motion.div>
              ))}
            </div>

            {/* Description + Features */}
            <div className='space-y-6'>

              {/* Description */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h1 className='text-xl font-medium mb-3'>Description</h1>
                <p className='text-gray-500'>{car.description}</p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <h1 className='text-xl font-medium mb-3'>Features</h1>
                <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                  {[
                    '360 Camera',
                    'Bluetooth',
                    'GPS',
                    'Heated Seats',
                    'Rear View Mirror',
                  ].map(item => (
                    <li
                      key={item}
                      className='flex items-center text-gray-500'
                    >
                      <img
                        src={assets.check_icon}
                        className='h-4 mr-2'
                        alt=""
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

            </div>

          </motion.div>

        </div>

        {/* Right Section */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit} className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'>

            {/* Price */}
            <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
              {currency}{car.pricePerDay}
              <span className='text-base text-gray-400 font-normal'>per day</span>
            </p>

            <hr className='border-borderColor my-6' />

            {/* Pickup Date */}
            <div className='flex flex-col gap-2'>
              <label htmlFor='pickup-date'>Pick-up Date</label>
              <input
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                type="date"
                className='border border-borderColor px-3 py-2 rounded-lg'
                id='pickup-date'
                min={(new Date().toISOString().split('T')[0])}
              />
            </div>

            {/* Return Date */}
            <div className='flex flex-col gap-2'>
              <label htmlFor='return-date'>Return Date</label>
              <input
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                type="date"
                className='border border-borderColor px-3 py-2 rounded-lg'
                id='return-date'
              />
            </div>

            {/* Book Now */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full bg-blue-500 hover:bg-blue-600 transition-all py-3 font-medium text-white rounded-xl cursor-pointer'
            >
              Book Now
            </motion.button>


            {/* Reservation Note */}
            <p className='text-center text-sm'>
              No credit card required to reserve
            </p>

          </form>
        </motion.div>

      </div>
    </div>
  ) : (
    <Loader />
  )
}

export default CarDetails
