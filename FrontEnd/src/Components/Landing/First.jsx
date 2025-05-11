import React, { useEffect, useState } from 'react'
import { RiHome6Line } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { MdOutlineEventNote } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import axios from 'axios';
import { data } from 'react-router-dom';


const First = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");


  useEffect(()=>{
    const fetchProfile = async() =>{
      try {
        const res = await axios.get("http://localhost:3000/api/user/Profile",{
          withCredentials : true
        })

        const data = res.data;
        setName(data.name)
        setEmail(data.email)
        setImage(data.image)

      } catch (error) {
        console.log(error)
      }
    }

    fetchProfile()
  }, [])

  
  

  return (
    <div className='p-4 h-screen '>
        <div className='bg-white shadow-lg p-5 rounded-2xl'>
            <div className='Profile p-5 bg-gray-50 rounded-2xl'>
                <div className='pro-sec flex gap-2 items-center'>
                    <img src={image || "./Profile.png"} alt="Profile_image" className='w-10 h-10 rounded-full'/>
                    <div>
                    <h1>{name}</h1>
                    <p>{email}</p>
                    </div>
                </div>
                <div className='section2 flex items-center mt-3 gap-5'>
                        <div>
                            <h2 className='font-semibold'>2k</h2>
                            <p>followers</p>
                        </div>

                        <div >
                            <h2 className='font-semibold'>235</h2>
                            <p>Following</p>
                        </div>

                        <div>
                            <h2 className='font-semibold'>80</h2>
                            <p>Post</p>
                        </div>
                </div>
            </div>
        </div>
        

        <div className='Feed-section bg-white shadow-lg p-2 mt-2 rounded-2xl'>
             <div className='Sec-1 p-2'>
                <h3 className='flex items-center gap-5 p-3 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black mt-2'><RiHome6Line />Feed</h3>
                <h3 className='flex items-center gap-5 p-3 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black mt-2'><FaUserFriends />Friends</h3>
                <h3 className='flex items-center gap-5 p-3 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black mt-2'><MdOutlineEventNote />Event</h3>
                <h3 className='flex items-center gap-5 p-3 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black mt-2'><MdOutlineEventNote />Photos</h3>
                <h3 className='flex items-center gap-5 p-3 rounded-2xl hover:bg-[#1B56FD] hover:text-white text-black mt-2'><IoVideocam />Videos</h3>
             </div>

             <div className='bg-gray-200 h-[3px] w-full'/>

             <div className='Sec-2 p-4 mt-3'>
                      <h3>Pages you like</h3>
                      <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded"></div>
                      <span className="text-gray-600">UI/UX Community...</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-300 rounded"></div>
                      <span className="text-gray-600">Web Designer</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-pink-500 rounded"></div>
                      <span className="text-gray-600">Dribbble Community</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded"></div>
                      <span className="text-gray-600">Behance</span>
                      <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-blue-500 text-sm mt-2 cursor-pointer">View All</p>
                  </div>
             </div>

        </div>

        <div className="text-xs text-gray-500 flex space-x-2 mt-2">
                  <a href="#" className="hover:underline">Privacy</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Terms</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Advertising</a>
                  <span>·</span>
                  <a href="#" className="hover:underline">Cookies</a>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Social © 2023
            </div>
    </div>
  )
}

export default First