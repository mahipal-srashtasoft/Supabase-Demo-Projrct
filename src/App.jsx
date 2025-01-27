import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddProductForm from "./Components/AddProductForm";
import ProductTable from "./Components/ProductTable";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import PrivateRoute from "./Components/PrivateRoute";
import Category from "./Components/Category";

function App() {
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="p-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/show-products" element={<ProductTable />} />
            <Route path="/*" element={<h1 className="h-[100vh] bg-red-500 flex justify-center items-center text-4xl text-white">Oops ! 404  <br /> Page Not Found</h1>} />

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
              path="/category"
              element={
                <PrivateRoute>
                  <Category />
                </PrivateRoute>
              }
            />
            <Route
              path={"/add-product/:id"}
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
