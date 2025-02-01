const Weather = require('../models/weather.js')
const axios = require('axios')
const { stringify } = require('flatted')
const fs = require('fs')
const possibleLocations = fs.readFileSync('locations.txt', 'utf8').split('\n')

const getWeather = async (location) => {
  try {
    console.log(location)
    const weather = await axios.get(
      'https://api.meteo.lt/v1/places/' + location + '/forecasts/long-term'
    )
    const weatherData = []
    var max = 0
    var min = 0
    weather.data.forecastTimestamps.forEach((item) => {
      let data = {
        time: item.forecastTimeUtc,
        temp: item.airTemperature,
        consdition: item.conditionCode,
        date: item.forecastTimeUtc.split(" ")[0]
      }
      if (data.temp < min) min = data.temp
      if (data.temp > max) max = data.temp
      weatherData.push(data)
    })
    const newWeather = new Weather({
      location,
      maxTemp: max,
      minTemp: min,
      forecast: weatherData,
    })
    await newWeather.save()
    if (!newWeather) return {}
    return newWeather
  } catch (error) {
    return { message: error.message }
  }
}

const getCityInfo = async (req, res) => {
  try {
    const city = req.params.city.toLowerCase()
    var weatherData = await Weather.find({ location: city })
    if (!weatherData || weatherData.length === 0) {
      weatherData = await getWeather(city)
    }
    return res.status(200).json(weatherData)
  } catch (error) {
    return res.status(404).json({ message: error.message, error: error })
  }
}

const getDayInfo = async (req, res) => {
  try {
    const city = req.params.city.toLowerCase()
    const inputDate = new Date(req.params.date)
    const formattedDate = inputDate.toISOString().split("T")[0]
    var weatherData = await Weather.findOne({
      location: city,
      forecast: { $elemMatch: { date: formattedDate } },
    })
    if (!weatherData) return res.status(404).json({message: "city not found"})
    const daysWeather = weatherData.forecast.filter(item => item.date === formattedDate)
    return res.status(200).json({data: daysWeather})

  } catch (error) {
    return res.status(404).json({ message: error.message, error: error })
  }
}

module.exports = {
  getCityInfo,
  getDayInfo,
}
