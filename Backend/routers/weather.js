const express = require('express')
const router = express.Router()
const {getCityInfo, getDayInfo} = require("../controllers/weather.js")

router.get("/weather/:city", getCityInfo)
router.get("/weather/:city/:date", getDayInfo)

module.exports = router