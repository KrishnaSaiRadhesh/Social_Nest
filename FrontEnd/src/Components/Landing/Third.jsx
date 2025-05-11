import React from 'react'
import { RiEditBoxLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { IoFilterSharp } from "react-icons/io5";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';


const Third = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    
    const fetchAllUsers = async () => {
      setLoading(true)
      try {
        const res = await axios.get("http://localhost:3000/api/auth/allUsers", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })

        const data = res.data
        setUsers(data)
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
    }

    fetchAllUsers();
  }, [])

  const handleFollow = async (userId) => {
   try {
     const res = await axios.post(`http://localhost:3000/api/users/follow/${userId}`, {
      withCredentials: true
    })
   } catch (error) {
      console.log(error)
   }

  }

  const handleUnFollow = async (userId) => {
   try {
     const res = await axios.post(`http://localhost:3000/api/users/Unfollow/${userId}`, {
      withCredentials: true
    })
   } catch (error) {
      console.log(error)
   }

  }


 
  return (
    <div className='p-4 h-screen bg-white shadow-lg'>
        <div className='p-3 flex items-center gap-3 justify-between w-full mt-1'>
            <h2 className='text-lg font-medium'>Messages</h2>
            <RiEditBoxLine size={25} />
        </div>

        <div className='bg-gray-100 flex items-center mt-1 gap-1 p-3 rounded-2xl'>
          <FiSearch />
          <input type="text" placeholder='Search' className='outline-none'/>
          <IoFilterSharp />
        </div>


        <div className='mt-3'>
            <div className='flex flex-col  items-left gap-3 mt-5'>
                {users.map((user, index) => (
                  <div key={index} className='flex items-center gap-3'>
                      <img src={user.image || "/Profile.png"} alt=""  className='w-10 h-10 rounded-full'/>
                      <h3 className='font-semibold text-[15px]'>{user.name}</h3>
                      <button className='bg-blue-500 text-white p-4' onClick={}>Follow</button>
                  </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Third