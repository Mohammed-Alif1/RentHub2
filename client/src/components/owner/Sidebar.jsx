import React, { useState } from 'react'
import { assets, ownerMenus } from '../../assets/assets'
import { useLocation, NavLink } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext()
  const location = useLocation()
  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  const updateImage = async () => {
    if (!image) return;

    try {
      setUploading(true);
      const formData = new FormData()
      formData.append('image', image)
      const { data } = await axios.post('/api/user/update-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (data.success) {
        toast.success("Image updated successfully")
        setImage(null)
        fetchUser()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-w13 md:max-w-60 w-full border-r border-borderColor text-sm'>

      {/* Profile Image */}
      <div className='group relative'>
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : (user?.image
                  ? (user.image.startsWith('http') ? user.image : import.meta.env.VITE_API_URL + user.image)
                  : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300")
            }
            alt="profile"
            className="w-24 h-24 rounded-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", e.target.src);
              console.log("User image value:", user?.image);
              console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
              e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300";
            }}
          />

          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => {
              console.log("File selected:", e.target.files[0]);
              setImage(e.target.files[0]);
            }}
          />

          {/* Hover Edit Icon */}
          <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
            <img src={assets.edit_icon} alt="Edit" />
          </div>
        </label>
      </div>

      {/* Save Button */}
      {image && (
        <button
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-1 rounded-full mt-3 text-xs cursor-pointer hover:bg-blue-700 transition-all'
          onClick={updateImage}
        >
          Save Image<img src={assets.upload_icon} className="w-4 h-4" />
        </button>
      )}

      {/* User Name */}
      <p className='mt-2 text-base max-md:hidden'>{user?.name || "Owner"}</p>

      {/* Navigation Menu */}
      <div className='w-full'>
        {ownerMenus.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={`
              relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6
              ${link.path === location.pathname ? 'bg-primary/10 text-primary' : 'text-gray-600'}
            `}
          >
            <img
              src={link.path === location.pathname ? link.coloredIcon : link.icon}
              alt={`${link.name} icon`}
            />
            <span className='max-md:hidden'>{link.name}</span>

            {link.path === location.pathname && (
              <div className='bg-primary w-1.5 h-8 rounded-r-lg absolute right-0' />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
