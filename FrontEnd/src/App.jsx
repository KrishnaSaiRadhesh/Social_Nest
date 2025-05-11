import React from 'react'
import StartPage from './Components/StartPage'
import Login from './Components/Login'
import Signup from './Components/Signup'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import Profile from './Components/Profile/Profile'
import UpdateProfile from './Components/Profile/UpdateProfile'
import CreatePost from './Components/Posts/CreatePost'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/home" element={<LandingPage/>}/>
        <Route path='/Profile' element={<Profile/>}/>
        <Route path='/UpdateProfile' element ={<UpdateProfile/>}/>
        <Route path='/CreatePost' element={<CreatePost/>}/>
   
      </Routes>
    </div>
  )
}

export default App