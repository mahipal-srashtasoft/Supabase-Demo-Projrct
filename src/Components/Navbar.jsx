import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); 
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">My App</div>
        <ul className="flex space-x-4">
          {isLoggedIn && (
            <li>
              <NavLink
                to="/add-product"
                className={({ isActive }) =>
                  isActive
                    ? "text-white font-semibold"
                    : "text-gray-200 hover:text-white"
                }
              >
                Add Product
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/show-products"
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold"
                  : "text-gray-200 hover:text-white"
              }
            >
              Show Products
            </NavLink>
          </li>
          {!isLoggedIn && (
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "text-white font-semibold"
                    : "text-gray-200 hover:text-white"
                }
              >
                Login
              </NavLink>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button
                onClick={handleLogout}
                className="text-gray-200 hover:text-white"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
