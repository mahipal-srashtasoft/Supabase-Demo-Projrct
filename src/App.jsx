import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProductForm from "./Components/AddProductForm";
import ProductTable from "./Components/ProductTable";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar /> {/* Navbar appears on all pages */}
        <div className="p-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/show-products" element={<ProductTable />} />

            {/* Private Route */}
            <Route
              path="/add-product"
              element={
                <PrivateRoute>
                  <AddProductForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-product/:id"
              element={
                <PrivateRoute>
                  <AddProductForm />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
