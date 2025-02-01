import { Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import Navbar from "./components/Navbar.jsx"
import "./index.css";
import {WeatherProvider} from "./uttils/WeatherContext.jsx";
function App() {
  return (
    <div className="overflow-hidden flex flex-col">
      <WeatherProvider>
      <Navbar />
      <Routes>
        <Route path="/:city" element={<Home />} />
        <Route path="/home" element={<Home />} />
        {/* Add more routes here */}
      </Routes>
      </WeatherProvider>
    </div>
  );
}

export default App;