import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import AddProjectModal from "./ProjectsComponent/AddProjectModal";
import DeleteModal from "../components/ui/modal/DeleteModal";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Eye,
  Edit,
  User,
  MapPin,
  CalendarDays,
  CalendarCheck,
  FileText,
  Plus,
  Wrench,
  Droplet,
  Truck,
  X,
  UserPen,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Trash2,
} from "lucide-react";

type Project = {
  project_id: number;
  name: string;
  person_in_charge: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  created_by: string;
  project_status: string;
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // For view
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null); // For edit

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleEditProject = (project: Project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
    console.log(project);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/projects/delete/${
            projectToDelete.project_id
          }`
        );

        setProjects(
          projects.filter((p) => p.project_id !== projectToDelete.project_id)
        );

        toast.success("Project deleted successfully.");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("There was an error deleting the project.");
      }

      setIsDeleteModalOpen(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsModalOpen(false);
    setProjectToDelete(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (selectedProject) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/projects/update-status/${
            selectedProject.project_id
          }`,
          { project_status: newStatus }
        );

        setSelectedProject({
          ...selectedProject,
          project_status: newStatus,
        });

        setSelectedProject(null);
        toast.success(`Project has been successfully ${newStatus}`);
        fetchProjects();
      } catch {
        toast.error(`Error updating project status to ${newStatus}`);
      }
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <PageMeta title="Projects" description="" />
      <PageBreadcrumb pageTitle="Projects" />

      <div className="min-h-full overflow-x-hidden rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-8">
        <div className="rounded-xl overflow-x-auto max-h-[62vh] border w-full border-gray-200 p-4 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] scrollbar-thin dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 scrollbar-rounded">
          <div className="top-0 overflow-x-auto z-10 px-5 py-3 flex flex-col sm:flex-row gap-2 shadow-sm">
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
              <option value="All">Sort by Status</option>
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
              <option>Sort by Date of Creation</option>
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
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {projects
              .filter((project) => {
                const status = project.project_status;
                const statusMatch =
                  statusFilter === "All" || status === statusFilter;
                return statusMatch;
              })
              .sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
              })
              .map((project) => {
                return (
                  <div
                    key={project.project_id}
                    className={`relative flex flex-col justify-between rounded-xl border border-gray-200 border-b-4 bg-white p-4 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-white/[0.05] ${
                      project.project_status === "Upcoming"
                        ? "border-b-green-600 dark:border-b-green-400"
                        : project.project_status === "On-Going"
                        ? "border-b-yellow-600 dark:border-b-yellow-400"
                        : project.project_status === "Completed"
                        ? "border-b-blue-600 dark:border-b-blue-400"
                        : project.project_status === "Cancelled"
                        ? "border-b-red-600 dark:border-b-red-400"
                        : project.project_status === "Extended"
                        ? "border-b-purple-600 dark:border-b-purple-400"
                        : project.project_status === "Overtime"
                        ? "border-b-orange-600 dark:border-b-orange-400"
                        : "border-b-gray-300"
                    }`}
                  >
                    {/* STATUS BADGE */}
                    <span
                      className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs font-semibold ${
                        project.project_status === "Upcoming"
                          ? "bg-green-500/10 text-green-600 dark:bg-green-400/10 dark:text-green-400"
                          : project.project_status === "On-Going"
                          ? "bg-yellow-400/10 text-yellow-700 dark:bg-yellow-300/10 dark:text-yellow-300"
                          : project.project_status === "Completed"
                          ? "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400"
                          : project.project_status === "Cancelled"
                          ? "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400"
                          : project.project_status === "Extended"
                          ? "bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400"
                          : project.project_status === "Overtime"
                          ? "bg-orange-500/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {project.project_status}
                    </span>

                    {/* CARD CONTENT */}
                    <div>
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
                        {new Date(project.end_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        Date Created:&nbsp;
                        {new Date(project.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        Created By:&nbsp;
                        {project.created_by}
                      </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="absolute bottom-4 right-5 z-10 flex justify-end gap-2">
                      <button
                        onClick={() => handleViewProject(project)}
                        className="flex items-center text-green-500 hover:text-gray-400 transition"
                      >
                        <Eye className="w-6 h-6" />
                      </button>

                      {(project.project_status === "Upcoming" ||
                        project.project_status === "On-Going") && (
                        <button
                          onClick={() => handleEditProject(project)}
                          className="flex items-center text-blue-500 hover:text-blue-400 transition"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}

                      {project.project_status === "Cancelled" && (
                        <button
                          onClick={() => handleDeleteProject(project)}
                          className="flex items-center text-red-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}

                      <DeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={handleCloseDeleteModal}
                        onConfirm={handleConfirmDelete}
                        itemName={projectToDelete?.name}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          {projects.length === 0 && (
            <div className="mt-10 text-center text-gray-500 dark:text-gray-400">
              No projects found.
            </div>
          )}
        </div>
        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setProjectToEdit(null);
            fetchProjects();
          }}
          project={projectToEdit}
        />
        {selectedProject && (
          <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50">
            <div className="relative z-10 w-full max-w-[45vw] overflow-y-auto rounded-xl bg-white px-5 py-4 shadow-lg dark:bg-gray-900">
              <div className="absolute top-2 right-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  className=" text-gray-300 bg-white dark:bg-gray-900"
                >
                  <X size={25} className="hover:text-red-600" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[70vh] scrollbar-thin dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 scrollbar-rounded">
                <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mr-5">
                  <div className="flex justify-between items-center w-full">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {selectedProject.name}
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(
                        selectedProject.created_at
                      ).toLocaleDateString()}
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
                        <p className="text-sm ml-6">
                          {selectedProject.location}
                        </p>
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
                          {new Date(
                            selectedProject.end_date
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
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
                    <div className="w-full">
                      <span className="font-bold inline-flex items-center gap-2">
                        <UserPen size={16} /> Created By:
                      </span>
                      <p className="text-sm ml-6 mb-5">
                        {selectedProject.created_by}
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
                          Total Vehicles:{" "}
                          {selectedProject.vehicles?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table for Attached Tools */}
                <div className="mt-6">
                  <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mr-5">
                    <h3 className="text-base font-semibold text-black dark:text-gray-300">
                      Tools and Equipments
                    </h3>

                    <div className="mt-3 overflow-hidden rounded-xl">
                      <table className="w-full text-sm table-auto  text-gray-700 dark:text-gray-300">
                        <thead className="bg-gray-400 dark:bg-gray-700 text-sm dark:text-gray-300 text-black rounded-t-xl">
                          <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Tag</th>
                            <th className="px-4 py-3 text-left">Category</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-50 dark:bg-white/[0.02]">
                          {selectedProject.tools &&
                          selectedProject.tools.length > 0 ? (
                            selectedProject.tools.map((tool) => (
                              <tr
                                key={tool.id}
                                className="hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
                              >
                                <td className="px-4 py-3 text-xs">
                                  {tool.name}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                  {tool.tag}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                  {tool.category}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                              >
                                No tools attached
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Table for Attached Consumables */}
                <div className="mt-6">
                  <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mr-5">
                    <h3 className="text-base font-semibold text-black dark:text-gray-300">
                      Consumables
                    </h3>

                    <div className="mt-3 overflow-hidden rounded-xl">
                      <table className="w-full text-sm table-auto text-gray-700 dark:text-gray-300">
                        <thead className="bg-gray-400 dark:bg-gray-700 text-sm dark:text-gray-300 text-black rounded-t-xl">
                          <tr>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Tag</th>
                            {/* <th className="px-4 py-3 text-left">Quantity</th> */}
                            <th className="px-4 py-3 text-left">Unit</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-50 dark:bg-white/[0.02]">
                          {selectedProject.consumables &&
                          selectedProject.consumables.length > 0 ? (
                            selectedProject.consumables.map((item, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
                              >
                                <td className="px-4 py-3 text-xs">
                                  {item.name}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                  {item.tag}
                                </td>
                                {/* <td className="px-4 py-3 text-xs">
                                  {item.allocated_quantity}
                                </td> */}
                                <td className="px-4 py-3 text-xs">
                                  {item.unit}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                              >
                                No consumables attached
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Table for Attached Vehicles */}
                <div className="mt-6">
                  <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mr-5">
                    <h3 className="text-base font-semibold text-black dark:text-gray-300">
                      Vehicles
                    </h3>

                    <div className="mt-3 overflow-hidden rounded-xl">
                      <table className="w-full text-sm table-auto text-gray-700 dark:text-gray-300">
                        <thead className="bg-gray-400 dark:bg-gray-700 text-sm dark:text-gray-300 text-black rounded-t-xl">
                          <tr>
                            <th className="px-4 py-3 text-left">
                              Vehicle Name
                            </th>
                            <th className="px-4 py-3 text-left">Plate No.</th>
                            <th className="px-4 py-3 text-left">
                              Assigned Driver
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-50 dark:bg-white/[0.02]">
                          {selectedProject.vehicles &&
                          selectedProject.vehicles.length > 0 ? (
                            selectedProject.vehicles.map((vehicle) => (
                              <tr
                                key={vehicle.id}
                                className="hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
                              >
                                <td className="px-4 py-3 text-xs">
                                  {vehicle.name}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                  {vehicle.plate_no}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                  {vehicle.assigned_driver}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                              >
                                No vehicles attached
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {selectedProject.project_status !== "Cancelled" &&
                    selectedProject.project_status !== "Completed" && (
                      <div className="mt-5 flex justify-center w-full">
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-gray-900 sm:px-6 mr-5">
                          <div className="flex gap-3">
                            {selectedProject.project_status === "Upcoming" ? (
                              <button
                                onClick={() => handleStatusChange("Cancelled")}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-800 dark:hover:bg-rose-700 dark:text-white transition shadow-sm"
                              >
                                <XCircle className="w-4 h-4" />
                                Cancel Project
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusChange("Completed")
                                  }
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-800 dark:hover:bg-emerald-700 dark:text-white transition shadow-sm"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Mark as Complete
                                </button>

                                <button
                                  onClick={() => handleStatusChange("Extended")}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-yellow-100 hover:bg-yellow-200 text-yellow-700 dark:bg-yellow-800 dark:hover:bg-yellow-700 dark:text-white transition shadow-sm"
                                >
                                  <RefreshCcw className="w-4 h-4" />
                                  Extend Project
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
