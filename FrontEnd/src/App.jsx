import React from 'react'
import StartPage from './Components/StartPage'
import Login from './Components/Login'
import Signup from './Components/Signup'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './Pages/LandingPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/home" element={<LandingPage/>}/>
      </Routes>
    </div>
  )
}

export default App