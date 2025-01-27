import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // Import your Supabase client
import toast, { Toaster } from "react-hot-toast";
import HOC from "./HOC/HOC";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Supabase authentication API
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(`Login failed: ${error.message}`);
        toast.error("Login error: "+ error);
      } else {
        // Save the token to localStorage (if needed for further API calls)
        const token = data.session?.access_token;
        localStorage.setItem("token", token);

        toast.success("Login successful!");
        navigate("/add-product"); // Redirect to Add Product page
      }
    } catch (err) {
      toast.error("Unexpected error: "+ err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Toaster />
    <form
      onSubmit={handleLogin}
      className="bg-white p-6 rounded-md shadow-md container m-auto max-w-sm mt-12"
    >

      <h2 className="text-xl font-bold mb-4">Login</h2>

      {/* Email Input */}
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Password Input */}
      <div className="mb-4 relative">
        <label className="block mb-2">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center text-gray-600"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <i className="fa-regular fa-eye"></i>
            ) : (
              <i className="fa-regular fa-eye-slash"></i>
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`px-4 py-2 text-white rounded-md ${
          isSubmitting
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
    </>
  );
}

export default HOC(Login);
