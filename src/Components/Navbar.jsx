import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";


function Navbar() {
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut();
    console.log(error)
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleLogin = () => {
    // After successful login, set the token in localStorage and update the state
    localStorage.setItem("token", "your-login-token");
    setIsLoggedIn(true);
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">My App</div>
        <ul className="flex space-x-4">
          {isLoggedIn && (
            <>
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
              <li>
                <NavLink
                  to="/category"
                  className={({ isActive }) =>
                    isActive
                      ? "text-white font-semibold"
                      : "text-gray-200 hover:text-white"
                  }
                >
                  Category
                </NavLink>
              </li>
            </>
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
              Products
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
