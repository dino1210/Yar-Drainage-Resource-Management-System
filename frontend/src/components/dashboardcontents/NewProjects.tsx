import { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  User,
  CalendarDays,
  FolderPlus,
  CircleDot,
} from "lucide-react";

interface Project {
  project_id: number;
  name: string;
  person_in_charge: string;
  location: string;
  start_date: string;
  end_date: string;
  created_at: string;
  project_status: string;
}

export default function NewProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/projects/recent`
        );
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="overflow-hidden h-[48vh] rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <h2 className="text-xl font-semibold text-gray-500 dark:text-gray-200 mb-4 flex items-center gap-2">
        <FolderPlus className="text-gray-800 size-6 dark:text-white/90" />
        Recent Projects
      </h2>
      <div className="space-y-4 overflow-y-auto max-h-[36vh] scrollbar-thin dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 scrollbar-rounded">
        {projects.map((project) => (
          <div
          key={project.project_id}
          className="relative cursor-pointer rounded-xl mr-4 mb-4 border border-gray-200 bg-white p-5 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-white/[0.05]"
        >
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-1">
              {project.name}
            </h3>
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 gap-2 mb-1">
              <User className="w-4 h-4" />
              <span>{project.person_in_charge}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 gap-2 mb-1">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>
                {new Date(project.start_date).toLocaleDateString()} —{" "}
                {new Date(project.end_date).toLocaleDateString()}
              </span>
            </div>
            <span
              className={`absolute bottom-3 right-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
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
                  : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              <CircleDot className="w-3 h-3" />
              {project.project_status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
