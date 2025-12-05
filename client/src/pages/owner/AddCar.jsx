import React, { useState } from "react";
import Title from "../../components/owner/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const AddCar = () => {
  const { axios, isOwner, navigate, currency } = useAppContext();

  const [image, setImage] = useState(null);

  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("brand", car.brand);
      formData.append("model", car.model);
      formData.append("year", car.year);
      formData.append("pricePerDay", car.pricePerDay);
      formData.append("category", car.category);
      formData.append("transmission", car.transmission);
      formData.append("fuel_type", car.fuel_type);
      formData.append("seating_capacity", car.seating_capacity);
      formData.append("location", car.location);
      formData.append("description", car.description);

      const res = await axios.post("/api/owner/add-car", formData);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/owner");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, specifications, and availability."
      />

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 text-gray-600 text-sm mt-6 max-w-xl"
      >
        {/* Car Image Upload */}
        <div className="flex flex-col">
          <label>Car Image</label>

          <label htmlFor="carImage" className="cursor-pointer">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Car"
                className="w-40 h-28 rounded-md object-cover border border-borderColor mt-1"
              />
            ) : (
              <div className="w-40 h-28 rounded-md border-2 border-dashed border-borderColor mt-1 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
                {/* Car Icon SVG */}
                <svg
                  className="w-14 h-14 text-gray-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
                <p className="text-xs text-gray-500 mt-1 font-medium">Upload Car</p>
              </div>
            )}
          </label>

          <input
            id="carImage"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Brand */}
        <div className="flex flex-col">
          <label>Brand</label>
          <input
            type="text"
            placeholder="Toyota, BMW..."
            className="px-3 py-2 border border-borderColor rounded-md mt-1 outline-none"
            value={car.brand}
            onChange={(e) => setCar({ ...car, brand: e.target.value })}
            required
          />
        </div>

        {/* Model */}
        <div className="flex flex-col">
          <label>Model</label>
          <input
            type="text"
            placeholder="Corolla, X5..."
            className="px-3 py-2 border border-borderColor rounded-md mt-1 outline-none"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
            required
          />
        </div>

        {/* Year */}
        <div className="flex flex-col">
          <label>Year</label>
          <input
            type="number"
            min="1990"
            max="2030"
            className="px-3 py-2 border border-borderColor rounded-md mt-1 outline-none"
            value={car.year}
            onChange={(e) => setCar({ ...car, year: e.target.value })}
            required
          />
        </div>

        {/* Price Per Day */}
        <div className="flex flex-col">
          <label>Price Per Day</label>
          <input
            type="number"
            placeholder="Cost per day"
            className="px-3 py-2 border border-borderColor rounded-md mt-1 outline-none"
            value={car.pricePerDay}
            onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            required
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label>Category</label>
          <select
            className="px-3 py-2 border border-borderColor rounded-md mt-1 outline-none"
            value={car.category}
            onChange={(e) => setCar({ ...car, category: e.target.value })}
            required
          >
            <option value="">Select category</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>

        {/* Transmission */}
        <div className="flex flex-col">
          <label>Transmission</label>
          <select
            className="px-3 py-2 border border-borderColor rounded-md mt-1 outline-none"
            value={car.transmission}
            onChange={(e) => setCar({ ...car, transmission: e.target.value })}
            required
          >
            <option value="">Select transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {/* Fuel Type */}
        <div className="flex flex-col">
          <label>Fuel Type</label>
          <select
            className="px-3 py-2 border border-borderColor rounded-md mt-1 outline-none"
            value={car.fuel_type}
            onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
            required
          >
            <option value="">Select fuel type</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Seating Capacity */}
        <div className="flex flex-col">
          <label>Seating Capacity</label>
          <input
            type="number"
            placeholder="4, 5, 7..."
            className="px-3 py-2 border border-borderColor rounded-md mt-1 outline-none"
            value={car.seating_capacity}
            onChange={(e) =>
              setCar({ ...car, seating_capacity: e.target.value })
            }
            required
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label>Location</label>
          <select
            className="px-3 py-2 border border-borderColor rounded-md mt-1 outline-none"
            value={car.location}
            onChange={(e) => setCar({ ...car, location: e.target.value })}
            required
          >
            <option value="">Select a location</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Houston">Houston</option>
            <option value="Chicago">Chicago</option>
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label>Description</label>
          <textarea
            rows={5}
            placeholder="Describe your car..."
            className="px-3 py-2 border border-borderColor rounded-md mt-1 outline-none"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white font-medium rounded-md mt-2 hover:bg-blue-700 transition"
        >
          <img src={assets.tick_icon} alt="tick" className="w-5" />
          {loading ? 'Loading...' : 'List Your Car'}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
