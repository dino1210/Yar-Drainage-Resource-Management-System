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

const ToolForm: React.FC<ToolFormProps> = ({
  onClose,
  onAddSuccess,
  toolToEdit,
}) => {
  useEffect(() => {
    console.log(
      " Current USER from localStorage:",
      localStorage.getItem("username")
    );
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
        purchase_date: toolToEdit.purchase_date
          ? new Date(toolToEdit.purchase_date)
          : null,
        warranty: toolToEdit.warranty ? new Date(toolToEdit.warranty) : null,
      });
    }
  }, [toolToEdit]);

  const warrantyOptions = [
    { label: "3 months", value: 3 },
    { label: "6 months", value: 6 },
    { label: "12 months", value: 12 },
  ];

  const [selectedWarrantyMonths, setSelectedWarrantyMonths] = useState<
    number | null
  >(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user || Object.keys(user).length === 0) {
      console.error("User is not valid in localStorage.");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("brand", formData.brand);
    form.append("category", formData.category);
    form.append("tag", formData.tag);
    form.append("description", formData.description);
    form.append("remarks", formData.remarks);
    form.append("status", formData.status);
    form.append("created_by", user.name);

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

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChangeCategory = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData({ ...formData, category: value });

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = categoryList
      .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5);

    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (value: string) => {
    setFormData({ ...formData, category: value });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const categoryList = [
    "Angle Grinder",
    "Drill Machine",
    "Vertical Grinder",
    "Pencil Grinder",
    "Circular Saw",
    "Chainsaw",
    "Grass Cutter",
    "Electric Drill",
    "Portable Drill",
    "Sanding Machine",
    "Jackhammer",
    "Vibrator",
    "Pumps",
    "Vacuum",
    "Electric Blower",
    "Light",
    "Charger",
    "Radio",
    "Cement Mixer",
    "Nail Gun",
    "Heat Gun",
    "Compressor",
    "Ladder",
    "Shovel",
    "Body Harness",
    "Traffic Cone",
    "Hose",
  ];

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

        <div className="relative">
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChangeCategory}
            autoComplete="off"
            required
            className="border rounded-md p-2 text-xs bg-white text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 w-full"
          />

          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 top-full mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-gray-300 bg-white text-xs shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-700 z-10">
              {suggestions.slice(0, 2).map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
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
        <select
          className="border rounded-md p-2 bg-white text-xs text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 w-full"
          onChange={(e) => {
            const months = parseInt(e.target.value, 10);
            setSelectedWarrantyMonths(months);

            if (formData.purchase_date) {
              const newWarrantyDate = new Date(formData.purchase_date);
              newWarrantyDate.setMonth(newWarrantyDate.getMonth() + months);
              setFormData((prev) => ({
                ...prev,
                warranty: newWarrantyDate,
              }));
            } else {
              setFormData((prev) => ({
                ...prev,
                warranty: null,
              }));
            }
          }}
          value={selectedWarrantyMonths ?? ""}
          disabled={!formData.purchase_date}
        >
          <option value="" disabled>
            Select warranty period
          </option>

          {warrantyOptions.map((option) => {
            let displayText = option.label;

            if (
              formData.warranty &&
              selectedWarrantyMonths === option.value &&
              formData.purchase_date
            ) {
              const tempDate = new Date(formData.purchase_date);
              tempDate.setMonth(tempDate.getMonth() + option.value);
              displayText = tempDate.toISOString().split("T")[0];
            }

            return (
              <option key={option.value} value={option.value}>
                {displayText}
              </option>
            );
          })}
        </select>
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
