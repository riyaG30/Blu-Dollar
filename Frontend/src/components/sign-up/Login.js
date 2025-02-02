import Cookies from "js-cookie";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(<FaEyeSlash />);
    const navigate = useNavigate();

    const validateEmail = (value) => {
        if (!value.endsWith("@ibm.com")) {
            setEmailError("Invalid email. Please use an @ibm.com credentials.");
        } else {
            setEmailError("");
        }
    };

    const validatePassword = () => {
        if (!password) {
            setPasswordError("Password is required.");
        } else {
            setPasswordError("");
        }
    };

    const handleEmailBlur = () => {
        validateEmail(email);
    };

    const handlePasswordToggle = () => {
        if (type === "password") {
            setIcon(<FaEye />);
            setType("text");
        } else {
            setIcon(<FaEyeSlash />);
            setType("password");
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        validateEmail(email);
        validatePassword();

        if (emailError || passwordError || !email || !password) {
            alert("Please fix the errors before submitting.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5500/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include credentials like cookies with the request
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error(
                    `Error: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json(); // Parse the JSON response
            console.log("Response Data:", data); // Print JSON response to the console

            // Store the token in cookies
            Cookies.set("token", data.token, {
                path: "/", // Cookie available on all pages

                sameSite: "Strict", // Prevent CSRF attacks
            });

            // Store the token in local storage
            //localStorage.setItem("token", data.token);
            console.log(
                "Token in LocalStorage:",
                localStorage.getItem("token")
            );

            if (data.role === "employee") {
                navigate("/booking");
            } else {
                navigate("/manager");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundImage:
                    "url('https://t4.ftcdn.net/jpg/05/51/93/35/360_F_551933523_nBWNQeC6vA8sDE6DDDQeo3YmSRQnlOjN.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div
                className="p-8 rounded-lg shadow-md w-full max-w-md"
                style={{ backgroundColor: "rgba(210, 180, 140, 0.8)" }}
            >
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">Blu-Reserve System</h2>
                    <p className="text-gray-1000">Cafeteria Seat Reservation</p>
                </div>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            IBM W3 ID
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={handleEmailBlur}
                            placeholder="username@ibm.com"
                            className={`mt-1 block w-full px-3 py-2 border rounded-md text-gray-900 shadow-sm ${
                                emailError
                                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                            }`}
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm mt-1">
                                {emailError}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4 relative">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative w-full">
                            <input
                                type={type}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={validatePassword}
                                placeholder="********"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md text-gray-900 shadow-sm ${
                                    passwordError
                                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                }`}
                            />
                            <span
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={handlePasswordToggle}
                            >
                                {icon}
                            </span>
                        </div>
                        {passwordError && (
                            <p className="text-red-500 text-sm mt-1">
                                {passwordError}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Sign in with W3 ID
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                    Need help? Contact your manager or IT support
                </p>
            </div>
        </div>
    );
};

export default Login;
