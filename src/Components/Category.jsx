import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import Loader from "./Loader";
import Swal from "sweetalert2";
import HOC from "./HOC/HOC";

function Category() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  // Fetch categories
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

  useEffect(() => {
    fetchCategories();
  }, []);



  // Handle category deletion
  const handleDeleteCategory = (id) => async () => {
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
        const { error } = await supabase.from("product_categories").delete().eq("id", id);
        if (error) throw new Error(error.message);

        Swal.fire("Deleted!", "The category has been deleted.", "success");
        fetchCategories();
      } catch (err) {
        console.error("Error deleting category:", err.message);
        Swal.fire("Error!", err.message, "error");
      }
    }
  };

  // Handle category form submission (create or update)
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        // Edit category
        const { error } = await supabase
          .from("product_categories")
          .update({ category_name: categoryName })
          .eq("id", selectedCategory.id);
        
        if (error) throw new Error(error.message);

        Swal.fire("Updated!", "The category has been updated.", "success");
      } else {
        // Add new category
        const { error } = await supabase.from("product_categories").insert([{ category_name: categoryName }]);
        if (error) throw new Error(error.message);

        Swal.fire("Created!", "The category has been created.", "success");
      }
      setCategoryName('');
      setSelectedCategory(null);
      fetchCategories();
    } catch (err) {
      console.error("Error saving category:", err.message);
      Swal.fire("Error!", "Failed to save the category.", "error");
    }
  };
  if (!categories.length) return <Loader />;

  return (
    <div className="overflow-x-auto">


      {/* Category Management Section */}
      <h2 className="text-xl font-bold mt-8 mb-4">Category Management</h2>
      <form onSubmit={handleCategorySubmit} className="mb-4">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          className="px-4 py-2 border border-gray-300 rounded-md"
          required
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
          {selectedCategory ? "Update Category" : "Add Category"}
        </button>
      </form>

      <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white shadow-md rounded-md">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left border-b border-gray-300">Category Name</th>
            {localStorage.getItem("token") && (
              <th className="px-4 py-2 text-left border-b border-gray-300">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b border-gray-300">{category.category_name}</td>
              {localStorage.getItem("token") && (
                <td className="px-4 py-2 border-b border-gray-300">
                  <button
                    className="p-2 rounded-l-lg cursor-pointer text-white bg-yellow-500"
                    onClick={() => {
                      setSelectedCategory(category);
                      setCategoryName(category.category_name);
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    className="p-2 rounded-r-lg cursor-pointer text-white bg-red-500"
                    onClick={handleDeleteCategory(category.id)}
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HOC(Category);
