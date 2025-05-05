import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import AddProjectModal from "./ProjectsComponent/AddProjectModal";
import axios from "axios";
import { Eye, Edit, User, MapPin, CalendarDays, CalendarCheck, FileText, Plus, Wrench, Droplet, Truck} from "lucide-react";

type Project = {
  project_id: number;
  name: string;
  person_in_charge: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  status?: "Upcoming" | "On-Going" | "Completed" | "Cancelled";
  tools: Array<{ id: number; name: string; category: string; tag: string }>;
  consumables: Array<{
    id: number;
    name: string;
    tag: string;
    allocated_quantity: number;
    unit: string;
    quantity: string;
  }>;
  vehicles: Array<{
    id: number;
    name: string;
    plate_no: string;
    assigned_driver: string;
  }>;
};

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);


  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/projects`
      );
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchProjects();
  };

  const isUpcoming = (startDate: string) => {
    const today = new Date();
    const projectStartDate = new Date(startDate);
    return projectStartDate > today;
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const handleEditProject = () => {
    setIsModalOpen(true);
  };

  const getProjectStatus = (start: string, end: string): string => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (endDate < now) return "Completed";
    if (startDate > now) return "Upcoming";
    if (startDate <= now && endDate >= now) return "On-Going";
    return "Cancelled";
  };

  return (
    <div>
      <PageMeta title="Projects" description="" />
      <PageBreadcrumb pageTitle="Projects" />

      <div className="min-h-full rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-8">
        <div className="rounded-xl border w-full border-gray-200 p-4 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="sticky top-0 overflow-x-auto z-10 px-5 py-3 flex flex-col sm:flex-row gap-2 shadow-sm">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by project name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 text-xs rounded-md w-full sm:w-1/3 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            />
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 text-xs rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            >
              <option value="All">All</option>
              <option value="Upcoming">Upcoming</option>
              <option value="On-Going">On-Going</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="border p-2 text-xs rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 text-xs rounded-md bg-blue-600 dark:bg-blue-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            >
              Add Project
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-4"></div>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects
              .filter((project) => {
                const status = getProjectStatus(
                  project.start_date,
                  project.end_date
                );

                const statusMatch =
                  statusFilter === "All" || status === statusFilter;
                return statusMatch;
              })
              .sort((a, b) => {
                const dateA = new Date(a.start_date).getTime();
                const dateB = new Date(b.start_date).getTime();
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
              })
              .map((project) => {
                const upcoming = isUpcoming(project.start_date);
                return (
                  <div
                    key={project.project_id}
                    className={`cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-white/[0.05] ${
                      upcoming
                        ? "border-b-4 border-green-500"
                        : "border-b-4 border-gray-200"
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {project.location}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(project.start_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}{" "}
                      →{" "}
                      {new Date(project.end_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      {(() => {
                        const status = getProjectStatus(
                          project.start_date,
                          project.end_date
                        );
                        const badgeStyles: Record<string, string> = {
                          Upcoming: "bg-green-100 text-green-800",
                          "On-Going": "bg-yellow-100 text-yellow-800",
                          Completed: "bg-blue-100 text-blue-800",
                          Cancelled: "bg-red-100 text-red-800",
                        };

                        return (
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                              badgeStyles[status] || "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {status}
                          </span>
                        );
                      })()}
                      <div className="flex">
                        <button
                          onClick={() => handleViewProject(project)}
                          className="flex items-center text-green-500 hover:text-gray-400 px-2 py-0.5 transition"
                        >
                          <Eye className="w-5" />
                        </button>
                        <button
                          onClick={() => handleEditProject()}
                          className="flex items-center text-blue-500 hover:text-blue-400 px-2 py-0.5 transition"
                        >
                          <Edit className="w-4" /> 
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* No Projects */}
          {projects.length === 0 && (
            <div className="mt-10 text-center text-gray-500 dark:text-gray-400">
              No projects found.
            </div>
          )}
        </div>

        <AddProjectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="z-10 w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
              <div className="overflow-y-auto max-h-[65vh] scrollbar-thin dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 scrollbar-rounded">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {selectedProject.name}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedProject.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-4 space-y-3 text-base p-5 text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between space-x-4">
                    <div className="flex-1">
                      <span className="font-bold inline-flex items-center gap-2">
                        <User size={16} /> Person In Charge:
                      </span>
                      <p className="text-sm ml-6">
                        {selectedProject.person_in_charge}
                      </p>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold inline-flex items-center gap-2">
                        <MapPin size={16} /> Location:
                      </span>
                      <p className="text-sm ml-6">{selectedProject.location}</p>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-4">
                    <div className="flex-1">
                      <span className="font-bold inline-flex items-center gap-2">
                        <CalendarDays size={16} /> Start Date:
                      </span>
                      <p className="text-sm ml-6">
                        {new Date(
                          selectedProject.start_date
                        ).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex-1">
                      <span className="font-bold inline-flex items-center gap-2">
                        <CalendarCheck size={16} /> Expected End Date:
                      </span>
                      <p className="text-sm ml-6">
                        {new Date(selectedProject.end_date).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="w-full">
                    <span className="font-bold inline-flex items-center gap-2">
                      <FileText size={16} /> Description:
                    </span>
                    <p className="text-sm ml-6">
                      {selectedProject.description}
                    </p>
                  </div>
                  <div className="w-full flex flex-wrap gap-2">
                    <div className="flex items- text-xs gap-2 border p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
                      <Wrench
                        size={15}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <span className="font-bold text-gray-800 dark:text-white">
                        Total Tools: {selectedProject.tools?.length || 0}
                      </span>
                    </div>

                    <div className="flex items-center text-xs gap-2 border p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
                      <Droplet
                        size={15}
                        className="text-green-600 dark:text-green-400"
                      />
                      <span className="font-bold text-gray-800 dark:text-white">
                        Total Consumables:{" "}
                        {selectedProject.consumables?.length || 0}
                      </span>
                    </div>

                    <div className="flex items-center text-xs gap-2 border p-4 rounded-xl shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
                      <Truck
                        size={15}
                        className="text-yellow-600 dark:text-yellow-400"
                      />
                      <span className="font-bold text-gray-800 dark:text-white">
                        Total Vehicles: {selectedProject.vehicles?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table for Attached Tools */}
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-black dark:text-gray-300">
                    Tools and Equipments
                  </h3>
                  <table className="mt-3 w-full text-xs table-auto border-collapse">
                    <thead className="text-black bg-gray-700 dark:text-gray-300 text-sm">
                      <tr>
                        <th className="px-4 py-2 border  border-gray-300 text-left">
                          Tool Name
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          Tag
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="dark:text-gray-400 ">
                      {selectedProject.tools &&
                      selectedProject.tools.length > 0 ? (
                        selectedProject.tools.map((tool) => (
                          <tr key={tool.id}>
                            <td className="px-4 py-2 border border-gray-300">
                              {tool.name}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                              {tool.tag}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                              {tool.category}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-2 border-gray-300 text-center text-gray-500"
                          >
                            No tools attached
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table for Attached Consumables */}
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-black dark:text-gray-300">
                    Consumables
                  </h3>
                  <table className="mt-3 w-full text-xs table-auto border-collapse">
                    <thead className="text-black bg-gray-700 dark:text-gray-300 text-sm">
                      <tr>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          Name
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          Tag
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          Quantity
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          Unit
                        </th>
                      </tr>
                    </thead>
                    <tbody className="dark:text-gray-400">
                      {selectedProject.consumables &&
                      selectedProject.consumables.length > 0 ? (
                        selectedProject.consumables.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border border-gray-300">
                              {item.name}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                              {item.tag}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                              {item.allocated_quantity}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                              {item.unit}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-2 border-gray-300 text-center text-gray-500"
                          >
                            No consumables attached
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table for Attached Vehicles */}
                <div className="mt-6">
                  <h3 className="text-base font-semibold text-black dark:text-gray-300">
                    Vehicles
                  </h3>
                  <table className="mt-3 w-full text-xs table-auto border-collapse">
                    <thead className="text-black bg-gray-700 dark:text-gray-300 text-sm">
                      <tr>
                        <th className="px-4 py-2 border  border-gray-300 text-left">
                          Vehicle Name
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          Plate No.
                        </th>
                        <th className="px-4 py-2 border border-gray-300 text-left">
                          Assigned Driver
                        </th>
                      </tr>
                    </thead>
                    <tbody className="dark:text-gray-400 ">
                      {selectedProject.vehicles &&
                      selectedProject.vehicles.length > 0 ? (
                        selectedProject.vehicles.map((vehicle) => (
                          <tr key={vehicle.id}>
                            <td className="px-4 py-2 border border-gray-300">
                              {vehicle.name}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                              {vehicle.plate_no}
                            </td>
                            <td className="px-4 py-2 border border-gray-300">
                              {vehicle.assigned_driver}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-4 py-2 border-gray-300 text-center text-gray-500"
                          >
                            No vehicles attached
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 text-right">
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
