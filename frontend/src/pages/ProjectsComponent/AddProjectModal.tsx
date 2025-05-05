// AddProjectModal.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addDays } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  project?: Item | null;
};

type Item = {
  id: number;
  name: string;
  [key: string]: any;
};

interface Consumable {
  consumable_id: number;
  name: string;
  tag: string;
  quantity: number;
  unit: string;
}

const AddProjectModal: React.FC<Props> = ({ isOpen, onClose, project }) => {
  const [startDate, setStartDate] = useState<Date | null>(
    project?.start_date || null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    project?.end_date || null
  );
  const [name, setName] = useState(project?.name || "");
  const [personInCharge, setPersonInCharge] = useState(
    project?.person_in_charge || ""
  );
  const [location, setLocation] = useState(project?.location || "");
  const [description, setDescription] = useState(project?.description || "");

  const [toolSearch, setToolSearch] = useState("");
  const [consumableSearch, setConsumableSearch] = useState("");
  const [vehicleSearch, setVehicleSearch] = useState("");

  const [toolResults, setToolResults] = useState([]);
  const [consumableResults, setConsumableResults] = useState<Consumable[]>([]);
  const [vehicleResults, setVehicleResults] = useState([]);

  const [selectedTools, setSelectedTools] = useState<Item[]>(
    project?.tools || []
  );
  const [selectedConsumables, setSelectedConsumables] = useState<Item[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<Item[]>(
    project?.vehicles || []
  );

  const removeTool = (tool_id: number) => {
    setSelectedTools((prevTools) =>
      prevTools.filter((tool) => tool.tool_id !== tool_id)
    );
  };

  const removeConsumable = (consumable_id: number) => {
    setSelectedConsumables((prevConsumables) =>
      prevConsumables.filter(
        (consumable) => consumable.consumable_id !== consumable_id
      )
    );
  };

  const removeVehicle = (vehicle_id: number) => {
    setSelectedVehicles((prevVehicles) =>
      prevVehicles.filter((vehicle) => vehicle.vehicle_id !== vehicle_id)
    );
  };

  const searchTools = async (query: string) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/tools/search?q=${query}`
    );
    setToolResults(res.data);
  };

  const searchConsumables = async (query: string) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/consumables/search?q=${query}`
    );
    setConsumableResults(res.data);
  };

  const searchVehicles = async (query: string) => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/vehicles/search?q=${query}`
    );
    setVehicleResults(res.data);
  };

  const addTool = (tool: any) => {
    setSelectedTools((prev) => {
      if (prev.find((t) => t.tool_id === tool.tool_id)) return prev;
      return [...prev, tool];
    });
  };

  const addConsumable = (consumable: any) => {
    setSelectedConsumables((prev) => {
      if (prev.find((c) => c.consumable_id === consumable.consumable_id))
        return prev;
      return [...prev, consumable];
    });
  };

  const addVehicle = (vehicle: any) => {
    setSelectedVehicles((prev) => {
      if (prev.find((v) => v.vehicle_id === vehicle.vehicle_id)) return prev;
      return [...prev, vehicle];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const projectData = {
      name,
      person_in_charge: personInCharge,
      manager: user.id,
      location,
      description,
      start_date: startDate?.toISOString().split("T")[0],
      end_date: endDate?.toISOString().split("T")[0],
      tool_ids: selectedTools.map((tool) => tool.tool_id),
      consumable_ids: selectedConsumables.map(
        (consumable) => consumable.consumable_id
      ),
      vehicle_ids: selectedVehicles.map((vehicle) => vehicle.vehicle_id),
    };

    try {
      let response;
      if (project) {
        response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/projects/${project.id}`,
          projectData
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/projects`,
          projectData
        );
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          project
            ? "Project updated successfully!"
            : "Project created successfully!"
        );
        clearForm();
        onClose();
      } else {
        toast.error(`Unexpected response: ${response.status}`);
      }
    } catch (error: any) {
      console.error("Error creating or updating project:", error);
      const errorMsg =
        error.response?.data?.message || "Error processing project!";
      toast.error(errorMsg);
    }
  };

  const clearForm = () => {
    setName("");
    setPersonInCharge("");
    setLocation("");
    setDescription("");
    setStartDate(null);
    setEndDate(null);
    setSelectedTools([]);
    setSelectedConsumables([])
    setSelectedVehicles([]);
    setToolResults([]);
    setConsumableResults([]);
    setVehicleResults([]);
  };

  const [addedQuantities, setAddedQuantities] = useState<
    Record<string, number>
  >({});

  const handleQuantityChange = (consumableId: string, change: number) => {
    // Find the selected consumable by ID
    const consumable = selectedConsumables.find(
      (item) => item.consumable_id === consumableId
    );

    if (consumable) {
      const availableQuantity = consumable.quantity;
      const currentAddedQuantity = addedQuantities[consumableId] || 0; // Get the current added quantity

      // Calculate the new added quantity
      let newAddedQuantity = currentAddedQuantity + change;

      // Prevent adding more than the available quantity
      if (newAddedQuantity > availableQuantity) {
        newAddedQuantity = availableQuantity;
      }

      // Prevent going below 0
      if (newAddedQuantity < 0) {
        newAddedQuantity = 0;
      }

      // Update the addedQuantities state
      setAddedQuantities({
        ...addedQuantities,
        [consumableId]: newAddedQuantity,
      });
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
        <div className="overflow-y-auto max-h-[65vh] scrollbar-thin dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 scrollbar-rounded">
          <div className="flex justify-between items-center mb-4 mr-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {project ? "Edit Project" : "Add New Project"}
            </h2>
            <button
              onClick={() => {
                onClose();
                clearForm();
              }}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="space-y-4 m-5" onSubmit={handleSubmit}>
            {/* Project Name */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Name
                </label>
                <input
                  type="text"
                  className="mt-1 w-full text-xs rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              {/* Person In Charge */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Person In Charge
                </label>
                <input
                  type="text"
                  className="mt-1 w-full text-xs rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter person in charge"
                  value={personInCharge}
                  onChange={(e) => setPersonInCharge(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location
              </label>
              <input
                type="text"
                className="mt-1 w-full text-xs rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                rows={3}
                className="mt-1 w-full text-xs rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex space-x-4 w-full">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => {
                    setStartDate(date);
                    if (endDate && date && endDate <= date) {
                      setEndDate(null); // reset if end date is invalid
                    }
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Choose date"
                  className="mt-1 w-full text-xs rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  minDate={new Date()}
                />
              </div>

              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expected End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={startDate ? addDays(startDate, 1) : undefined} // force to be at least one day after
                  placeholderText="Choose date"
                  className="mt-1 w-full text-xs rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            {/* TOOL SEARCH */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Attach Tools
              </h3>
              <input
                type="text"
                className="mb-2 w-full text-xs rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Search tools"
                value={toolSearch}
                onChange={(e) => {
                  setToolSearch(e.target.value);
                  searchTools(e.target.value);
                }}
              />

              {toolResults.length > 0 && (
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded mb-2">
                  <table className="min-w-full text-xs text-left table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                      <tr>
                        <th className="px-2 py-1">Name</th>
                        <th className="px-2 py-1">Tag</th>
                        <th className="px-2 py-1">Category</th>
                        <th className="px-2 py-1">Quality</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toolResults.map((tool: any) => (
                        <tr
                          key={tool.tool_id}
                          onClick={() => addTool(tool)}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {tool.name}
                          </td>
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {tool.tag}
                          </td>
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {tool.category}
                          </td>
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {tool.remarks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border border-gray-200 dark:border-gray-600 rounded mb-4 overflow-x-auto">
                <table className="min-w-full text-xs text-left table-auto">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-2 py-1">Name</th>
                      <th className="px-2 py-1">Tag</th>
                      <th className="px-2 py-1 w-6"></th>
                      {/* for remove button */}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTools.map((tool: any) => (
                      <tr
                        key={tool.tool_id}
                        className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
                      >
                        <td className="px-2 py-1 font-medium text-gray-800 dark:text-gray-100">
                          {tool.name}
                        </td>
                        <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                          {tool.tag}
                        </td>
                        <td className="px-2 py-1">
                          <button
                            onClick={() => removeTool(tool.tool_id)}
                            className="text-gray-500 my-auto hover:text-gray-700 text-sm font-bold"
                          >
                            <X className="w-4 mr-2" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CONSUMABLE SEARCH */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Attach Consumables
              </h3>

              {/* Search Input */}
              <input
                type="text"
                className="mb-2 w-full text-xs rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Search consumables"
                value={consumableSearch}
                onChange={(e) => {
                  setConsumableSearch(e.target.value);
                  searchConsumables(e.target.value); // Call search function
                }}
              />

              {/* Search Results Table */}
              {consumableResults.length > 0 && (
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded mb-2">
                  <table className="min-w-full text-xs text-left table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                      <tr>
                        <th className="px-2 py-1">Name</th>
                        <th className="px-2 py-1">Tag</th>
                        <th className="px-2 py-1">Available</th>
                        <th className="px-2 py-1">Unit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumableResults.map((consumable) => (
                        <tr
                          key={consumable.consumable_id}
                          onClick={() => addConsumable(consumable)}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {consumable.name}
                          </td>
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {consumable.tag}
                          </td>
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {consumable.quantity}
                          </td>
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {consumable.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Consumables List with Quantity Adjustment */}
              <div className="border border-gray-200 dark:border-gray-600 rounded mb-4 overflow-x-auto">
                <table className="min-w-full text-xs text-left table-auto">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-2 py-1">Name</th>
                      <th className="px-2 py-1">Tag</th>
                      <th className="px-2 py-1">Unit</th>
                      <th className="px-2 py-1">Available</th>
                      <th className="px-2 py-1">Added Quantity</th>
                      <th className="px-2 py-1 w-6"></th>
                      {/* For remove button */}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedConsumables.map((consumable) => (
                      <tr
                        key={consumable.consumable_id}
                        className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
                      >
                        <td className="px-2 py-1 font-medium text-gray-800 dark:text-gray-100">
                          {consumable.name}
                        </td>
                        <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                          {consumable.tag}
                        </td>
                        <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                          {consumable.unit}
                        </td>
                        <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                          {consumable.quantity}
                        </td>
                        <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  consumable.consumable_id,
                                  -1
                                )
                              }
                              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                            >
                              -
                            </button>
                            <span>
                              {addedQuantities[consumable.consumable_id] || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  consumable.consumable_id,
                                  1
                                )
                              }
                              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-2 py-1">
                          <button
                            onClick={() =>
                              removeConsumable(consumable.consumable_id)
                            }
                            className="text-gray-500 my-auto hover:text-gray-700 text-sm font-bold"
                          >
                            <X className="w-4 mr-2" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* VEHICLE SEARCH */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Attach Vehicles
              </h3>
              <input
                type="text"
                className="mb-2 w-full text-xs rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                placeholder="Search vehicles"
                value={vehicleSearch}
                onChange={(e) => {
                  setVehicleSearch(e.target.value);
                  searchVehicles(e.target.value);
                }}
              />

              {vehicleResults.length > 0 && (
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-600 rounded mb-2">
                  <table className="min-w-full text-xs text-left table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                      <tr>
                        <th className="px-2 py-1">Name</th>
                        <th className="px-2 py-1">Plate No.</th>
                        <th className="px-2 py-1">Assigned Driver</th>
                        <th className="px-2 py-1">Quality</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicleResults.map((vehicle: any) => (
                        <tr
                          key={vehicle.vehicle_id}
                          onClick={() => addVehicle(vehicle)}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {vehicle.name}
                          </td>
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {vehicle.plate_no}
                          </td>
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {vehicle.assigned_driver}
                          </td>
                          <td className="px-2 py-1 dark:text-gray-400 text-gray-600">
                            {vehicle.remarks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="border border-gray-200 dark:border-gray-600 rounded mb-4 overflow-x-auto">
                <table className="min-w-full text-xs text-left table-auto">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-2 py-1">Name</th>
                      <th className="px-2 py-1">Plate No.</th>
                      <th className="px-2 py-1">Assigned Vehicle</th>
                      <th className="px-2 py-1 w-6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVehicles.map((vehicle: any) => (
                      <tr
                        key={vehicle.vehicle_id}
                        className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
                      >
                        <td className="px-2 py-1 font-medium text-gray-800 dark:text-gray-100">
                          {vehicle.name}
                        </td>
                        <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                          {vehicle.plate_no}
                        </td>
                        <td className="px-2 py-1 text-gray-600 dark:text-gray-300">
                          {vehicle.assigned_driver}
                        </td>
                        <td className="px-2 py-1">
                          <button
                            onClick={() => removeVehicle(vehicle.vehicle_id)}
                            className="text-gray-500 my-auto hover:text-gray-700 text-sm font-bold"
                          >
                            <X className="w-4 mr-2" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end text-right gap-1">
              <button
                type="submit"
                className="w-full text-sm font-semibold py-2 px-4 bg-blue-600 text-white rounded-lg"
              >
                {project ? "Update Project" : "Create Project"}
              </button>
              <button
                type="button"
                onClick={() => {
                  clearForm();
                  onClose();
                }}
                className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
