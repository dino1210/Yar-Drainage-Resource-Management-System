import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { Upload } from "lucide-react";

type ConsumableFormProps = {
  onClose: () => void;
  onAddSuccess: () => void;
};

const ConsumableForm: React.FC<ConsumableFormProps> = ({ onClose, onAddSuccess }) => {
  const [formData, setFormData] = useState({
    picture: null as File | null,
    tag: " ",
    name: " ",
    category: " ",
    quantity: "",
    minStock: "",
    unit: " ",
    location: " ",
  });
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("tag", formData.tag);
    form.append("name", formData.name);
    form.append("category", formData.category);
    form.append("quantity", formData.quantity);
    form.append("minStock", formData.minStock);
    form.append("unit", formData.unit);
    form.append("location", formData.location);


    if (formData.picture) {
      form.append("picture", formData.picture);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/consumables`,
        {
          method: "POST",
          body: form,
        }
      );

      if (response.ok) {
        toast.success("Consumable added successfully!");
        onAddSuccess();
        onClose();
      } else {
        toast.error("Failed to add consumable");
      }
    } catch (error) {
      console.error("Error adding consumable", error);
      toast.error("Error adding consumable");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prevData) => ({
        ...prevData,
        picture: e.target.files![0],
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
      {/* Name */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Item Name
        </label>
        <input
          type="text"
          name="name"
          required
          value={formData.name || ""}
          onChange={handleInputChange}
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Tag/Code */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Tag/Code
        </label>
        <input
          type="text"
          name="tag"
          value={formData.tag || ""}
          required
          onChange={handleInputChange}
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Category
        </label>
        <input
          type="text"
          name="category"
          value={formData.category || ""}
          onChange={handleInputChange}
          required
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Quantity */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Quantity
        </label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity || ""}
          required
          onChange={handleInputChange}
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Minimum Stock */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Min. Stock
        </label>
        <input
          type="number"
          name="minStock"
          value={formData.minStock || ""}
          required
          onChange={handleInputChange}
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Unit */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Unit
        </label>
        <select
          name="unit"
          value={formData.unit || ""}
          onChange={handleInputChange}
          className="border rounded-md p-2 bg-white text-xs text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 w-full"
        >
          <option value="">Select unit</option>
          <option value="ml">ml</option>
          <option value="kg">kg</option>
          <option value="pcs">pcs</option>
          <option value="tubes">tubes</option>
          <option value="rolls">rolls</option>
          <option value="box">box</option>
          <option value="pairs">pairs</option>
          <option value="bottles">bottles</option>
          <option value="packs">packs</option>
          <option value="sets">sets</option>
        </select>
      </div>

      {/* Location */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location || ""}
          required
          onChange={handleInputChange}
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {/* Image Upload */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Image
        </label>
        <label className="cursor-pointer border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 text-center relative">
          <Upload className="w-4 h-4 absolute left-2 top-2" />
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Submit Button */}
      <div className="col-span-3 text-right mt-4 ">
        <button
          type="submit"
          className="px-5 py-2 mr-2 bg-blue-800 text-white text-xs rounded-md hover:bg-blue-700 transition"
        >
          Add
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 text-xs bg-red-800 dark:text-white rounded-md hover:bg-red-700 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ConsumableForm;