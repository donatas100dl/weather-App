import '../index.css'
import { useLocation } from 'react-router-dom'
import { useWeather } from '../uttils/WeatherContext.jsx'
import { useState, useEffect } from 'react'

function Home() {
  const location = useLocation()
  const { cities } = useWeather()
  const [city, setCity] = useState({})
  const [cityData, setCityData] = useState({})
  const [curentLocation, setCurentLocation] = useState("")
  useEffect(() => {
    setCurentLocation(location.pathname.split('/')[1].toLowerCase())
    if (cities && cities.length > 0) {
      const cityData = cities.find(
        (c) => c.city.toLowerCase() === curentLocation.toLowerCase()
      )
      if (cityData) {
        setCity(cityData)
      }
    }
  }, [cities])

  useEffect(() => {
    console.log('City:', city) // Debugging the city object

    if (!city || !city.weather || !Array.isArray(city.weather.forecast)) {
      console.log('Invalid forecast data:', city?.weather?.forecast)
      return // Exit if the forecast data is invalid
    } else {
      console.log('data correct', city?.weather?.forecast)
    }

    // Proceed only if forecast is an array
    const result = groupByDateAndCalculateAvgTemp(city.weather.forecast)
    console.log(result)

    const { formattedDate, formattedTime } = formatDateAndTime(
      '2025-01-30 16:00:00'
    )

    setCityData({
      city: city.city,
      forecast: result.splice(1, 4),
      formattedDate,
      formattedTime,
    })
  }, [city])

  const formatDateAndTime = (dateString) => {
    console.log(dateString)
    const date = new Date(dateString) // Convert string to Date object

    // Format the date (weekday, month, day)
    const dateOptions = {
      weekday: 'long', // Full weekday name (e.g., "Monday")
      month: 'long', // Full month name (e.g., "January")
      day: 'numeric', // Day of the month (e.g., 30)
    }

    const formattedDate = date.toLocaleDateString('en-US', dateOptions)

    // Get the current time
    const currentTime = new Date() // Current date and time
    const currentHours = currentTime.getHours() // Get current hours
    const currentMinutes = currentTime.getMinutes() // Get current minutes
    const formattedTime = `${currentHours}:${
      currentMinutes < 10 ? '0' + currentMinutes : currentMinutes
    }` // Format time as "13:00"

    return {
      formattedDate, // e.g., "Thursday, January 30"
      formattedTime, // e.g., current time like "16:00"
    }
  }

  const groupByDateAndCalculateAvgTemp = (data) => {
    // Step 1: Group data by date
    const grouped = data.reduce((acc, { date, temp }) => {
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(temp)
      return acc
    }, {})

    // Step 2: Calculate average temperature for each date
    const result = Object.keys(grouped).map((date) => {
      const temps = grouped[date]
      const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length

      return {
        date: date + ' ' + '00:00:00',
        temp: Math.round(avgTemp), // Round the average temperature
        condition: "Rain"
      }
    })

    return result
  }

  return cities?.length > 0 && city ? (
    <div className='z-10 h-full w-full absolute flex flex-col  pt-15 md:flex-row md:gap-20 md:p-20 justify-center items-center text-base md:text-3xl'>
      <div className='flex flex-col gap-10 p-10 grow-2'>
        <header className='w-full flex flex-col justify-center items-center md:ite'>
          <h1 className='text-5xl text-center text-white font-bold md:text-[5rem]'>
            {city.city}
          </h1>
          <p className='text-2xl text-center text-white flex gap-3'>
            {cityData.formattedDate} <p>{cityData.formattedTime}</p>
          </p>
        </header>

        {/* main temp */}

        <main className='flex flex-col justify-center items-center'>
          <h1 className='text-7xl text-center text-white flex relative p-5 pb-0 pl-0 md:text-[13rem]'>
            {Math.round(city?.weather?.forecast?.[0]?.temp)}
            <p className=' bottom-4 md:text-[10rem] md:bottom-20'>°C</p>
          </h1>
          <p className='text-2xl text-center text-white md:text-[2rem]'>
            {city?.weather?.forecast?.[0]?.consdition}
          </p>
        </main>
      </div>

      <section className=' text-white grid grid-cols-2 md:gap-25 grow-2'>
        {cityData?.forecast &&
          cityData.forecast.map((day, index) => (
            <div
              key={index}
              className='flex flex-col gap-2 p-3 justify-center items-center'
            >
              <h2 className='text-[1.1rem] md:text-4xl'>
                {formatDateAndTime(day.date).formattedDate.split(",")[0]}
              </h2>
              <span className='text-3xl md:text-6xl'>
                {Math.round(day.temp)}°C
              </span>
              <span className=''>{day.condition}</span>
            </div>
          ))}
      </section>

      {/* weather icons */}
      <div className=' flex justify-center items-center grow-1'>
        <button className=' text-white text-4xl rotate-90 md:rotate-180 md:p-5'>
          {'>'}
        </button>
      </div>
    </div>
  ) : (
    <div className='h-full w-full flex justify-center items-center text-white'>
      <h1>Loading...</h1>
    </div>
  )
}

export default Home
