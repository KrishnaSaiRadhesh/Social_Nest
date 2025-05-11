import React from 'react'
import Header from '../Components/Landing/Header'
import First from '../Components/Landing/First'
import Second from '../Components/Landing/Second'
import Third from '../Components/Landing/Third'


const LandingPage = () => {
  return (
    <div>
        <Header/>
        <div className='flex p-5 justify-around'>
          <First className=""/>
          <Second className=""/>
          <Third className=""/>
        </div>
        
    </div>
  )
}

export default LandingPage