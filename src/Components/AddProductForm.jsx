import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import HOC from "./HOC/HOC";

function AddProductForm() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(""); // Selected category ID
  const [categories, setCategories] = useState([]); // List of categories
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching categories
  const [fetchError, setFetchError] = useState(""); // Error state for fetching categories
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsUpdate(true);
      const fetchProduct = async () => {
        try {
          const { data, error } = await supabase
            .from("Product")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw new Error(error.message);
          setTitle(data.Title);
          setPrice(data.Price);
          setCategoryId(data.product_category_id);
        } catch (err) {
          toast.error("Error fetching product: " + err.message);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setFetchError("");
      try {
        const { data, error } = await supabase
          .from("product_categories")
          .select("id, category_name");

        if (error) throw new Error(error.message);
        setCategories(data || []);
      } catch (err) {
        setFetchError("Error fetching categories. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const resetForm = () => {
    setTitle("");
    setPrice("");
    setCategoryId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (Number(price) <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isUpdate) {
        const { error } = await supabase
          .from("Product")
          .update({
            Title: title,
            Price: price,
            product_category_id: categoryId,
          })
          .eq("id", id);
        if (error) throw new Error(error.message);
        toast.success("Product updated successfully!");
        navigate('/show-products');
      } else {
        const { error } = await supabase
          .from("Product")
          .insert([
            { Title: title, Price: price, product_category_id: categoryId },
          ]);
        if (error) throw new Error(error.message);
        toast.success("Product added successfully!");
      }
      resetForm();
    } catch (err) {
      console.error("Error submitting product:", err.message);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow-md rounded-md mb-6 container mx-auto max-w-md"
        aria-label="Product Form"
      >
        <h2 className="text-xl font-bold mb-4">
          {isUpdate ? "Update Product" : "Add New Product"}
        </h2>

        {/* Title Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        {/* Price Input */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="price"
          >
            Price
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border rounded-md"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            aria-required="true"
          />
        </div>

        {/* Category Dropdown */}
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="category"
          >
            Category
          </label>
          {isLoading ? (
            <p>Loading categories...</p>
          ) : fetchError ? (
            <p className="text-red-500">{fetchError}</p>
          ) : (
            <select
              id="category"
              className="w-full px-3 py-2 border rounded-md"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              aria-required="true"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded-md ${
            isSubmitting
              ? "bg-green-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isSubmitting}
        >
          {isUpdate
            ? isSubmitting
              ? "Updating..."
              : "Update Product"
            : isSubmitting
            ? "Adding..."
            : "Add Product"}
        </button>
      </form>

      {/* Link to View Products */}
      <Link to="/show-products" className="text-blue-600 hover:underline flex items-center justify-center">
        View Products
      </Link>
    </>
  );
}

export default HOC(AddProductForm);
