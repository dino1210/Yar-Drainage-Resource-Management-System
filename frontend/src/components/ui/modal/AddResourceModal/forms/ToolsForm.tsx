import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Upload } from "lucide-react";

type ToolFormProps = {
  onClose: () => void;
  onAddSuccess: () => void;
  toolToEdit?: any;
};

const ToolForm: React.FC<ToolFormProps> = ({ onClose, onAddSuccess, toolToEdit }) => {
  useEffect(() => {
    console.log(" Current USER from localStorage:", localStorage.getItem("username"));
  }, []);

  const [formData, setFormData] = useState({
    picture: null as File | null,
    name: "",
    brand: "",
    category: "",
    tag: "",
    description: "",
    purchase_date: null as Date | null,
    warranty: null as Date | null,
    remarks: "",
    status: "Available",
  });

  useEffect(() => {
    if (toolToEdit) {
      setFormData({
        ...toolToEdit,
        picture: null,
        purchase_date: toolToEdit.purchase_date ? new Date(toolToEdit.purchase_date) : null,
        warranty: toolToEdit.warranty ? new Date(toolToEdit.warranty) : null,
      });
    }
  }, [toolToEdit]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("brand", formData.brand);
    form.append("category", formData.category);
    form.append("tag", formData.tag);
    form.append("description", formData.description);
    form.append("remarks", formData.remarks);
    form.append("status", formData.status);
    const actualUser = localStorage.getItem("username") || "Unknown";
    console.log(" Username from localStorage:", actualUser);
    form.append("added_by", actualUser);





    if (formData.purchase_date) {
      form.append(
        "purchase_date",
        formData.purchase_date.toISOString().split("T")[0]
      );
    }

    if (formData.warranty) {
      form.append("warranty", formData.warranty.toISOString().split("T")[0]);
    }


    if (formData.picture) {
      form.append("picture", formData.picture);
    } else if (toolToEdit?.picture) {
      form.append("existing_picture", toolToEdit.picture);
    }
    
    try {
      const apiUrl = toolToEdit
        ? `${import.meta.env.VITE_API_BASE_URL}/api/tools/${toolToEdit.tool_id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/tools/`;

      const method = toolToEdit ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        body: form,
      });

      if (response.ok) {
        toast.success("Tool added successfully!");
        onAddSuccess();
        onClose();
      } else {
        toast.error("Failed to add tool");
      }
    } catch (error) {
      console.error("Error adding tool", error);
      toast.error("Error adding tool");
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedStatus = prevData.status;

      if (name === "remarks") {
        const val = value.toLowerCase();
        if (val.includes("need maintenance")) {
          updatedStatus = "Not Available";
        } else if (val.includes("repaired done")) {
          updatedStatus = "Available";
        }
      }

      return {
        ...prevData,
        [name]: value,
        status: updatedStatus,
      };
    });
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
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          required
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Brand
        </label>
        <input
          type="text"
          name="brand"
          value={formData.brand || ""}
          onChange={handleInputChange}
          required
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>

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

      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Date of Purchase
        </label>
        <DatePicker
          selected={formData.purchase_date}
          onChange={(date: Date | null) =>
            setFormData((prev) => ({
              ...prev,
              purchase_date: date,
            }))
          }
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="border rounded-md p-2 bg-white text-xs text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 w-full"
          calendarClassName="dark:bg-gray-700 dark:text-black"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          maxDate={new Date()}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Warranty
        </label>
        <DatePicker
          selected={formData.warranty}
          onChange={(date: Date | null) =>
            setFormData((prev) => ({
              ...prev,
              warranty: date,
            }))
          }
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="border rounded-md p-2 bg-white text-xs text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 w-full"
          calendarClassName="dark:bg-gray-700 dark:text-black"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Remarks
        </label>
        <input
          type="text"
          name="remarks"
          value={formData.remarks || ""}
          onChange={handleInputChange}
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>

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

      <div className="col-span-3 text-right mt-4 ">
        <button
          type="submit"
          className="px-5 py-2 mr-2 bg-blue-800 text-white text-xs rounded-md hover:bg-blue-700 transition"
        >
          {toolToEdit ? "Update" : "Add"}
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

export default ToolForm;
