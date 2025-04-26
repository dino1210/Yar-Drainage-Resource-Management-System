  import { useEffect, useState, ReactNode } from "react";
  import axios from "axios";
  import {
    Search,
    CircleCheck,
    CheckCircle2,
    CalendarDays,
    User2,
    UserRoundCheck,
    Construction,
    Clock,
    XCircle,
    Plus,
    Pencil,
  } from "lucide-react";
  import { Dialog } from "@headlessui/react";
  import DatePicker from "react-datepicker";
  import "react-datepicker/dist/react-datepicker.css";
  


  interface ProjectType {
    id: number;
    title: string;
    manager: string;
    personInCharge?: string;
    tools: string;
    startDate: string;
    endDate: string;
    status?: string;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusStyles: Record<string, string> = {
    Ongoing: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    Upcoming: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const statusIcons: Record<string, ReactNode> = {
    Ongoing: <CheckCircle2 className="w-4 h-4" />,
    Completed: <CircleCheck className="w-4 h-4" />,
    Upcoming: <Clock className="w-4 h-4" />,
    Cancelled: <XCircle className="w-4 h-4" />,
  };

  export default function Projects() {
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ProjectType>({
      id: 0,
      title: "",
      manager: "",
      personInCharge: "",
      tools: "",
      startDate: "",
      endDate: "",
      status: "Ongoing",
      

    }); 

    useEffect(() => {
      fetchProjects();
    }, []);

    const fetchProjects = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/projects");

    // Convert snake_case to camelCase manually
    const formatted = res.data.map((p: any) => ({
      id: p.id,
      title: p.title,
      manager: p.manager,
      personInCharge: p.person_in_charge, 
      tools: p.tools_equipment_used,      
      startDate: p.start_date,
      endDate: p.end_date,
      status: p.status,
    }));

    setProjects(formatted);
  } catch (err) {
    console.error("Error fetching projects:", err);
  }
};


    const handleOpenModal = (project?: ProjectType) => {
      if (project) {
        setIsEditing(true);
        setFormData(project);
      } else {
        setIsEditing(false);
        setFormData({
          id: 0,
          title: "",
          manager: "",
          personInCharge: "",
          tools: "",
          startDate: "",
          endDate: "",
          status: "Ongoing",
        });
      }
      setIsModalOpen(true);
    };

    const handleSave = async () => {
      if (!formData.title || !formData.manager || !formData.startDate || !formData.endDate || !formData.tools) {
        alert("Please fill out all required fields correctly.");
        return;
      }
      try {
        if (isEditing) {
          await axios.put(`http://localhost:5000/api/projects/${formData.id}`, formData);
        } else {
          await axios.post("http://localhost:5000/api/projects", formData);
        }
        fetchProjects();
        setIsModalOpen(false);
      } catch (err) {
        console.error("Error saving project:", err);
        alert("Error saving. Check your data and try again.");
      }
    };

    const filteredProjects = projects
    .filter((proj) => {
      const matchSearch = proj.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filter === "All" || proj.status === filter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
  
  if (a.status === "Completed" && b.status !== "Completed") return -1;
  if (a.status !== "Completed" && b.status === "Completed") return 1;

  return a.id - b.id;
})


    return (
      <div className="p-6 relative">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Projects</h2>

        <button
          onClick={() => handleOpenModal()}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
          title="Add Project"
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-3 text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project title..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((proj) => {
            const status = proj.status || "Ongoing";
            const toolsRaw = proj.tools ?? ""; // fallback kung undefined/null
            const toolsList = toolsRaw.replace(/\[|\]|"/g, "").split(",").map((t) => t.trim());

            const visibleTools = toolsList.slice(0, 4);
            const remainingTools = toolsList.length - visibleTools.length;

            return (
              <div
                key={proj.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border-l-4 p-6 transition-all hover:shadow-lg hover:scale-[1.01] ${
                  status === "Ongoing"
                    ? "border-green-500"
                    : status === "Completed"
                    ? "border-blue-500"
                    : status === "Upcoming"
                    ? "border-yellow-500"
                    : "border-red-500"
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 truncate">{proj.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <User2 className="w-5 h-5" />
                      <span><span className="text-gray-500">Manager:</span> {proj.manager}</span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <UserRoundCheck className="w-5 h-5" />
                      <span><span className="text-gray-500">Person in Charge:</span> {proj.personInCharge || "Not Assigned"}</span>
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <CalendarDays className="w-5 h-5" />
                      {formatDate(proj.startDate)} — {formatDate(proj.endDate)}
                    </p>
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1 flex items-center gap-2">
                      <Construction className="w-5 h-5" /> Tools / Equipment Used
                    </p>
                    <ul className="grid grid-cols-2 gap-x-4 list-disc ml-4 text-gray-700 dark:text-gray-300">
                      {visibleTools.map((tool, i) => <li key={i}>{tool}</li>)}
                      {remainingTools > 0 && <li className="italic text-gray-500">+{remainingTools} more...</li>}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <button
                      onClick={() => handleOpenModal(proj)}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium ${statusStyles[status]}`}>
                      {statusIcons[status]} {status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Panel className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                {isEditing ? "Edit Project" : "Add Project"}
              </Dialog.Title>

              <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                required
              />

              <input
                placeholder="Manager"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                required
              />

              <input
                placeholder="Person in Charge"
                value={formData.personInCharge}
                onChange={(e) => setFormData({ ...formData, personInCharge: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              />

              <div className="flex flex-col md:flex-row gap-2">
                <DatePicker
                  selected={formData.startDate ? new Date(formData.startDate) : null}
                  onChange={(date) => date && setFormData({ ...formData, startDate: date.toISOString().split("T")[0] })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholderText="Start Date"
                  dateFormat="yyyy-MM-dd"
                />
                <DatePicker
                  selected={formData.endDate ? new Date(formData.endDate) : null}
                  onChange={(date) => date && setFormData({ ...formData, endDate: date.toISOString().split("T")[0] })}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholderText="End Date"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <input
                placeholder="Tools (comma separated)"
                value={formData.tools}
                onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
                required
              />

              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 dark:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    );
  }