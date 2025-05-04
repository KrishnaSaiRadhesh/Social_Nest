import React from 'react'
import { HiOutlineSearch } from "react-icons/hi";
import { IoNotifications } from "react-icons/io5";
import { FaBookmark } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  return (
    <div className='bg-gray-100 p-5 flex items-center justify-around'>
        <div className='Logo flex items-center gap-3'>
            <img className= "w-10 h-10 rounded-full" src="./Logo.png" alt="logo image" />
            <h2 className='text-[28px] font-serif'>Social Nest</h2>
        </div>

        <div className='flex items-center gap-1 border-2 p-2 rounded-2xl w-[30em]'>
            <HiOutlineSearch />
            <input type="text" className='w-full outline-0'/>
        </div>

        <div className='flex items-center gap-[5em]'>
            <IoNotifications size={25}/>
            <FaBookmark size={25}/>
        </div>

        <div className=''>
            <CgProfile size={40}/>
        </div>
    </div>
  )
}

export default Header