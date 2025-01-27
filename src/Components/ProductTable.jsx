import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import Swal from "sweetalert2";
import HOC from "./HOC/HOC";

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const handleDelete = (id) => async () => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        const { error } = await supabase.from("Product").delete().eq("id", id);
        if (error) throw new Error(error.message);

        Swal.fire("Deleted!", "The product has been deleted.", "success");
        fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err.message);
        Swal.fire("Error!", "Failed to delete the product.", "error");
      }
    }
  };

  const handleEdit = (id) => async () => {
    navigate(`/add-product/${id}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("product_categories")
          .select("id, category_name");

        if (error) throw new Error(error.message);
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err.message);
      }
    };

    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("Product").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProducts();
    }
  }, []);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Product List</h2>
      {isLoading ? (
        <p className="text-gray-600">
          <Loader />
        </p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white shadow-md rounded-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left border-b border-gray-300">
                Title
              </th>
              <th className="px-4 py-2 text-left border-b border-gray-300">
                Price
              </th>
              <th className="px-4 py-2 text-left border-b border-gray-300">
                Category
              </th>
              {localStorage.getItem("token") && (
                <th className="px-4 py-2 text-left border-b border-gray-300">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b border-gray-300">
                  {product.Title}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {product.Price}
                </td>
                <td className="px-4 py-2 border-b border-gray-300">
                  {product.product_category_id &&
                    categories.find(
                      (category) => category.id === product.product_category_id
                    )?.category_name}
                </td>
                {localStorage.getItem("token") && (
                  <td className="px-4 py-2 border-b border-gray-300">
                    <button
                      className="p-2 rounded-l-lg cursor-pointer text-white bg-yellow-500"
                      onClick={handleEdit(product.id)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className="p-2 rounded-r-lg cursor-pointer text-white bg-red-500"
                      onClick={handleDelete(product.id)}
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HOC(ProductTable);
