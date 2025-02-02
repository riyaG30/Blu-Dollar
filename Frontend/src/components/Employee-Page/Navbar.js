import React from "react";
import { GrCafeteria } from "react-icons/gr";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const sendmeHome = () => {
        navigate('/')
    }
    return (
        <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <GrCafeteria className="text-3xl" />
                <h1 className="text-2xl font-bold">Blu-Reserve</h1>
            </div>
            <div className="flex items-center space-x-4">
                <p className="text-sm font-medium">John Doe</p>

                <IoIosLogOut className="text-2xl cursor-pointer" onClick={()=>{sendmeHome()}}/>
            </div>
        </nav>
    );
};

export default Navbar;
