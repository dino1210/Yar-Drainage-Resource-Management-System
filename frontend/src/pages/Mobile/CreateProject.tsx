import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    assignedTo: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResources, setSelectedResources] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Dummy resources (you’ll fetch this in real case)
  const dummyResources = [
    { id: 1, type: "tool", name: "Angle Grinder", tag: "TL-001" },
    { id: 2, type: "vehicle", name: "Truck 02", tag: "VH-005" },
    { id: 3, type: "consumable", name: "Welding Rod", tag: "CM-123" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        assets: selectedResources,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to create project");

      navigate("/mobile-scanner");
    } catch (error) {
      console.error("Project creation error:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const toggleResource = (resource: any) => {
    setSelectedResources((prev) => {
      const exists = prev.find((r) => r.id === resource.id);
      return exists
        ? prev.filter((r) => r.id !== resource.id)
        : [...prev, resource];
    });
  };

  const filteredResources = dummyResources.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="w-full text-gray-800 text-xs dark:text-white">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full border border-gray-300 dark:border-gray-700"
        >
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Project Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label htmlFor="assignedTo" className="block mb-1 font-medium">
              Assigned To
            </label>
            <input
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Resource Selector */}
          <div>
            <label className="block mb-1 font-medium">Project Assets</label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
            >
              + Assign Resources
            </button>

            {selectedResources.length > 0 && (
              <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {selectedResources.map((res) => (
                  <li key={res.id}>
                    <span className="font-semibold">{res.type}</span>:{" "}
                    {res.name} ({res.tag})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Create Project
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </form>
      </div>

      {/* Resource Selection Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40" />
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-[90%] max-w-xl">
            <Dialog.Title className="text-lg font-semibold mb-3">
              Select Project Resources
            </Dialog.Title>

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />

            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex justify-between items-center border px-3 py-2 rounded dark:border-gray-600"
                >
                  <div>
                    <p className="font-medium">{resource.name}</p>
                    <p className="text-xs text-gray-500">{resource.tag}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleResource(resource)}
                    className={`text-sm px-3 py-1 rounded ${
                      selectedResources.find((r) => r.id === resource.id)
                        ? "bg-red-500 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    {selectedResources.find((r) => r.id === resource.id)
                      ? "Remove"
                      : "Add"}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CreateProject;
