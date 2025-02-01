/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import axios from "axios";
const WeatherContext = createContext(); // Fixed the missing parentheses
const URL = "http://localhost:4000/api/v1/rooms";

export const WeatherProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [weather, setweather] = useState(false);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        var citiesCodes = getCitiesCodes();
    
        citiesCodes.forEach((city) => {
            getCity(city).then((weather) => {
                setCities(prevCities => [...prevCities, { city, weather }]);
            });
        });
    }, []);
    const getCitiesCodes = () => {
        return JSON.parse(localStorage.getItem("citys")) || [];
    };
    const getAllweathers = async () => {
        try {
            let res = await axios.get(URL + "");
            if (res) {
                setweather(res.data)
                setLoading(false)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getCity = async (cityCode) => {
        try {
            let res = await axios.get(`http://localhost:4000/api/weather/${cityCode}`);
            if (res) {
                return res.data[0];
            }
        } catch (error) {
            console.log(error);
        }
    }

    const makeReservation = async (data) => {
        try {
            let res = await axios.post(`${URL}/${data.id}/reserve`, data);
            if (res) {
                console.log(res.data);
                return res.data;
            }
        } catch (error) {
            console.log(error);
        }
    }
    const checkDateAvailable = async (date,id) => {
        try {
            console.log(date, id)
            let res = await axios.get(`${URL}/${id}/availability/checkin/${date.from}/checkout/${date.to}`);
            if (res) {
                console.log(res.data);
                return res.data.isRoomAvailable
            }
        } catch (error) {
            console.log(error);
        }
    }
    const checkReservation = async (data) => {
        try {
            let res = await axios.post(`${URL}/reserve/check`, data);
            if (res) {
                return res.data;
            }
        } catch (error) {
            if (error) {
                if (error.response.data.error === "Unauthorized") {
                    return {error: true};
                }
                console.log(error.data);
                return error.data
            }
            console.log(error);
        }
    }

    const reservationCancel = async (data) => {
        try {
            let res = await axios.post(`${URL}/reserve/cancel`, data);
            if (res) {
                return res.data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getFilteredRoom = async (data) => {
        try {
            let res = await axios.post(`${URL}/filter`, data);
            if (res) {
                return res.data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    const contextData = useMemo(() => ({
        getCity,
        cities,
    }), [cities]);

    return (
        <WeatherContext.Provider value={contextData}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeather = () => {
    return useContext(WeatherContext);
};

export default WeatherContext;