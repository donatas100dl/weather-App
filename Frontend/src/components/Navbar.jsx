/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import Hamburger from '../assets/hamburger.png'
import Pin from '../assets/pin.png'
import Cloudy from '../assets/cloudy.png'
import Search from '../assets/search.png'
import Close from '../assets/close.png'
import { Link, useLocation  } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useWeather } from "../uttils/WeatherContext.jsx"

function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const [manageLocation, setManageLocation] = useState(false)
  const location = useLocation();
  const {cities } = useWeather()
  const curent = location.pathname.split("/")[1].toLowerCase()
  useEffect(() => {
  },[cities])

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }
  const toggleManageLocation = () => {
    setManageLocation(!manageLocation)
  }
  const closeManageLocation = () => {
    setManageLocation(false)
  }
  return (
    <>
      {!showMenu ? (
        <nav className='z-20 w-full bg-transparent'>
          <div className='flex items-center justify-between py-5 px-3'>
            <img
              src={Hamburger}
              alt='Hamburger'
              className='w-[30px] h-[30px] cursor-pointer'
              onClick={toggleMenu}
            />
          </div>
        </nav>
      ) : (
        <div
          className={
            showMenu
              ? 'z-20 w-full  h-full absolute bg-[#3d5a6f35] backdrop-blur-md md:w-2xl'
              : 'hidden'
          }
        >
          <div className='flex items-start flex-col gap-5 justify-between py-3'>
            <img
              className='text-2xl text-white cursor-pointer select-none w-[30px] m-5 mb-0 '
              onClick={toggleMenu}
              src={Close}
              alt='Close'
            />
            <ul className='w-full flex flex-col mt-10'>
              {
                cities && cities.length>  0 ? 
                (
                  cities.map(city => (
                    <Link to={`/${city.city}`} key={city.city} className={`w-full flex justify-between items-center  px-10 py-3 hover:bg-[#c7c7c763] ${curent === city.city.toLowerCase() ? "bg-[#c7c7c763]" : ""}`}

                    >
                      <div className='flex w-max'>
                        <img
                          src={Pin}
                          alt='location pin'
                          className='mt-1 scale-110 size-fit '
                        />
                        <a
                          href='#'
                          className='ml-3 text-white text-4xl'
                        >
                          {city.city}
                        </a>
                      </div>
                      <div className='flex items-center'>
                        <img
                          src={Cloudy}
                          alt='Cloudy'
                          className='size-fit w-[52px] pb-1'
                        />
                        <span
                          href='#'
                          className='ml-3 text-white text-4xl'
                        >
                          -1°C
                        </span>
                      </div>
                    </Link>
                   ))
                )
                : (  <span>Loading...</span>)
            }
            </ul>
            <div className='w-full px-20 flex justify-center'>
              {!manageLocation ? (
                <button
                  className='z-30 border-2 bg-[#ffffff35] border-white text-white py-2 px-8 rounded-4xl backdrop-blur-3xl'
                  onClick={toggleManageLocation}
                >
                  Manage Locations
                </button>
              ) : (
                <div className='flex w-full bg-[#ffffff35] border-white text-white py-3 px-4 rounded-md backdrop-blur-3xl '>
                  <input
                    className='w-full focus:outline-0'
                    placeholder='Search location'
                    type='text'
                    maxLength="30"
                  />
                  <div className="w-[25%]  flex gap-4 items-center">
                  <img src={Search} alt="Search" />
                  <hr className='border-1  border-[#e1e1e1] h-full'/>
                  <img src={Close} alt="Close" className='size-fit border-[#e1e1e1]  flex w-[28px] items-center '
                  onClick={closeManageLocation}
                  />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
