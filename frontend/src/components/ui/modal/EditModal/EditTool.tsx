import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { Upload } from "lucide-react";

import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

type EditToolModalProps = {
  onClose: () => void;
  onUpdateSuccess: () => void;
  selectedTool: any; // Ideally replace 'any' with your Tool type
};

const EditToolModal = ({ toolData, onClose, onEditSuccess }: EditToolModalProps) => {
    if (!toolData) return null; // optional: early return for safety
  
    const [formData, setFormData] = useState({
      name: toolData.name || '',
      brand: toolData.brand || '',
      purchase_date: toolData.purchase_date ? new Date(toolData.purchase_date) : null,
      // other fields...
    });

type Category = {
  id: number;
  name: string;
};


const EditToolModal: React.FC<EditToolModalProps> = ({
  onClose,
  onUpdateSuccess,
  selectedTool,
}) => {
  const [formData, setFormData] = useState({
    ...selectedTool,
    purchase_date: selectedTool.purchase_date
      ? new Date(selectedTool.purchase_date)
      : null,
    warranty: selectedTool.warranty ? new Date(selectedTool.warranty) : null,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category: Category) => {
    setFormData(prev => ({ ...prev, category: category.name }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tools/${selectedTool.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            purchase_date: formData.purchase_date?.toISOString().split("T")[0],
            warranty: formData.warranty?.toISOString().split("T")[0],
          }),
        }
      );

      if (res.ok) {
        toast.success("Tool updated successfully!");
        onUpdateSuccess();
        onClose();
      } else {
        toast.error("Failed to update tool.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating.");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(formData.category?.toLowerCase() || "")
  );


  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
      {/* Same input fields as Add Tool, pre-filled with formData */}

      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
          className="border rounded-md p-2 text-xs bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Brand */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Brand</label>
        <input
          type="text"
          name="brand"
          value={formData.brand || ""}
          onChange={handleInputChange}
          required
          className="border rounded-md p-2 text-xs bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Category w/ suggestions */}
      <div className="flex flex-col relative">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category || ""}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          required
          className="border rounded-md p-2 text-xs bg-white dark:bg-gray-700 dark:text-white"
        />
        {showSuggestions && filteredCategories.length > 0 && (
          <ul className="absolute z-10 top-full left-0 w-full mt-1 rounded-md border bg-white dark:bg-gray-700 text-xs overflow-y-auto max-h-40">
            {filteredCategories.map((cat, i) => (
              <li
                key={i}
                onClick={() => handleCategorySelect(cat)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tag/Code */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Tag/Code</label>
        <input
          type="text"
          name="tag"
          value={formData.tag || ""}
          onChange={handleInputChange}
          className="border rounded-md p-2 text-xs bg-white dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="border rounded-md p-2 text-xs bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Purchase Date */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Date of Purchase</label>
        <DatePicker
          selected={formData.purchase_date || null}
          onChange={(date: Date | null) =>
            setFormData(prev => ({
              ...prev,
              purchase_date: date,
            }))
          }
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="border rounded-md p-2 text-xs bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Warranty */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Warranty</label>
        <DatePicker
          selected={formData.warranty || null}
          onChange={(date: Date | null) =>
            setFormData(prev => ({
              ...prev,
              warranty: date,
            }))
          }
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="border rounded-md p-2 text-xs bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Remarks */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Remarks</label>
        <input
          type="text"
          name="remarks"
          value={formData.remarks || ""}
          onChange={handleInputChange}
          className="border rounded-md p-2 text-xs bg-white dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Image Upload (optional logic for preview or change) */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Image</label>
        <label className="cursor-pointer border rounded-md p-2 text-xs bg-white dark:bg-gray-700 dark:text-white text-center">
          <Upload className="w-4 h-4 inline-block mr-1" />
          Upload Image
          <input type="file" className="hidden" />
        </label>
      </div>

      {/* Buttons */}
      <div className="col-span-3 text-right mt-4">
        <button
          type="submit"
          className="px-5 py-2 mr-2 bg-blue-800 text-white text-xs rounded-md hover:bg-blue-700 transition"
        >
          Save Changes
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
}
