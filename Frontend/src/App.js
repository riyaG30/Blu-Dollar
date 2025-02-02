import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Booking from "./components/Employee-Page/Booking";
import ForApis from "./components/ForApis";
import Manager from "./components/manager_dashboard/Manager";
import Login from "./components/sign-up/Login";
const App = () => {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<Dashboard />} /> */}
                <Route path="/" element={<Login />} />
                {/* <Route path="/" element={<Booking />} />  */}

                <Route path="/booking" element={<Booking />} />
                <Route path="/manager" element={<Manager />} />
                <Route path="/api" element={<ForApis />} />
            </Routes>
        </Router>
    );
};

export default App;
