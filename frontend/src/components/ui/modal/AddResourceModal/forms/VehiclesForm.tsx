import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Upload } from "lucide-react";

type VehicleFormProps = {
  onClose: () => void;
  onAddSuccess: () => void;
  vehicleToEdit?: any;
};

const VehicleForm: React.FC<VehicleFormProps> = ({ onClose, onAddSuccess, vehicleToEdit }) => {
  const [formData, setFormData] = useState({
    picture: null as File | null,
    name: "",
    brand: "",
    plate_no: "",
    category: "",
    fuel_type: "",
    location: "",
    acquisition_date: null as Date | null,
    warranty: null as Date | null,
    maintenance_due: null as Date | null,
    remarks: "",
    assigned_driver: "",
    status: "Available",
  });

 
  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        ...vehicleToEdit,
        picture: null,
        acquisition_date: vehicleToEdit.acquisition_date ? new Date(vehicleToEdit.acquisition_date) : null,
        warranty: vehicleToEdit.warranty ? new Date(vehicleToEdit.warranty) : null,
        maintenance_due: vehicleToEdit.maintenance_due ? new Date(vehicleToEdit.maintenance_due) : null,
      });
    }
  }, [vehicleToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("brand", formData.brand);
    form.append("plate_no", formData.plate_no);
    form.append("category", formData.category);
    form.append("fuel_type", formData.fuel_type);
    form.append("location", formData.location);
    form.append("remarks", formData.remarks);
    form.append("assigned_driver", formData.assigned_driver);
    form.append("status", formData.status);

    if (formData.acquisition_date) {
      form.append("acquisition_date", formData.acquisition_date.toISOString().split("T")[0]);
    }

    if (formData.warranty) {
      form.append("warranty", formData.warranty.toISOString().split("T")[0]);
    }

    if (formData.maintenance_due) {
      form.append("maintenance_due", formData.maintenance_due.toISOString().split("T")[0]);
    }

    if (formData.picture) {
      form.append("picture", formData.picture);
    } else if (vehicleToEdit?.picture) {
      form.append("existing_picture", vehicleToEdit.picture);
    }

    try {
      const apiUrl = vehicleToEdit
        ? `${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${vehicleToEdit.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/vehicles`;
      const method = vehicleToEdit ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method,
        body: form,
      });

      if (response.ok) {
        toast.success(vehicleToEdit ? "Vehicle updated successfully!" : "Vehicle added successfully!");
        onAddSuccess();
        onClose();
      } else {
        toast.error("Failed to save vehicle");
      }
    } catch (error) {
      console.error("Error saving vehicle", error);
      toast.error("Error saving vehicle");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  }
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
      {/* Name */}
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

      {/* Brand */}
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

      {/* Plate No. */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Plate No.
        </label>
        <input
          type="text"
          name="plate_no"
          value={formData.plate_no || ""}
          onChange={handleInputChange}
          required
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

      {/* Fuel Type */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Fuel Type
        </label>
        <select
          name="fuel_type"
          value={formData.fuel_type || ""}
          onChange={handleInputChange}
          className="border rounded-md p-2 bg-white text-xs text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 w-full"
        >
          <option></option>
          <option value="Gasoline">Gasoline</option>
          <option value="Diesel">Diesel</option>
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

      {/* Acquisition Date */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Acquisition Date
        </label>
        <DatePicker
          selected={formData.acquisition_date}
          onChange={(date: Date | null) =>
            setFormData((prev) => ({
              ...prev,
              acquisition_date: date,
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

      {/* Warranty */}
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

      {/* Maintenance Due */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Maintenance Due
        </label>
        <DatePicker
          selected={formData.maintenance_due}
          onChange={(date: Date | null) =>
            setFormData((prev) => ({
              ...prev,
              maintenance_due: date,
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

      {/* Remarks */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Remarks
        </label>
        <input
          type="text"
          name="remarks"
          value={formData.remarks || ""}
          onChange={handleInputChange}
          required
          className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {/* Assigned Driver */}
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-xs text-gray-700 dark:text-gray-300">
          Assigned Driver
        </label>
        <input
          type="text"
          name="assigned_driver"
          value={formData.assigned_driver || ""}
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
       {vehicleToEdit ? "Update" : "Add"}

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

export default VehicleForm;
