import React, { useState, useEffect } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import { motion } from 'motion/react'

const Cars = () => {

  const [input, setInput] = useState("")
  // Getting the search parameters from the URL
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const { cars, axios } = useAppContext()
  const isSearchData = pickupLocation && pickupDate && returnDate

  const [availableCars, setAvailableCars] = useState([])
  const [filteredCars, setFilteredCars] = useState([])

  const applyfilter = () => {
    let visibleCars = availableCars;

    if (input) {
      const searchTerms = input.toLowerCase().split(' ').filter(term => term.trim() !== '');

      visibleCars = visibleCars.filter(car => {
        const carString = `${car.brand} ${car.model} ${car.category} ${car.transmission}`.toLowerCase();
        return searchTerms.every(term => carString.includes(term));
      });
    }
    setFilteredCars(visibleCars);
  }

  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.get("/api/user/cars", {
        params: {
          pickupLocation,
          pickupDate,
          returnDate,
        },
      })
      if (data.success) {
        setAvailableCars(data.cars)
        setFilteredCars(data.cars)
        if (data.cars.length === 0) {
          toast.error("No cars available for the selected dates")
        }
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.error("Error fetching cars:", error?.response?.data || error.message)
      setAvailableCars([])
      setFilteredCars([])
    }
  }

  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability()
    } else {
      setAvailableCars(cars)
      setFilteredCars(cars)
    }
  }, [pickupLocation, pickupDate, returnDate, cars])

  useEffect(() => {
    applyfilter()
  }, [input, availableCars])

  return (
    <div className='pb-20'>

      {/* Header Section */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className='flex flex-col items-center py-20 bg-light max-md:px-4'
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Title
            title='Available Cars'
            subTitle='Browse our selection of premium vehicles available for your next adventure'
          />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'
        >
          <img
            src={assets.search_icon}
            alt="search"
            className='w-4.5 h-4.5 mr-2'
          />

          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder='Search by make, model, or features'
            className='w-full h-full outline-none text-gray-500'
          />

          <img
            src={assets.filter_icon}
            alt="filter"
            className='w-4.5 h-4.5 ml-2'
          />
        </motion.div>
      </motion.div>

      {/* Cars Grid */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'
      >
        <p>Showing {filteredCars.length} Cars</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars.map((car, index) => (
            <motion.div
              key={car._id || index}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

export default Cars
