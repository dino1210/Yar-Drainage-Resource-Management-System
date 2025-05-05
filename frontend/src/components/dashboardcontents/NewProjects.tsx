import { useEffect, useState } from "react";
import axios from "axios";

interface Project {
  project_id: number;
  name: string;
  person_in_charge: string;
  location: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export default function NewProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects/recent`);
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="overflow-hidden h-[48vh] rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 ">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Newly Created Projects
      </h2>
      <div className="space-y-4 overflow-y-auto max-h-[40vh] scrollbar-thin dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-800 scrollbar-rounded">
        {projects.map((project) => (
          <div
            key={project.project_id}
            className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 mr-5"
          >
            <h3 className="font-bold text-gray-900 dark:text-white">{project.name}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {project.person_in_charge} | {project.location}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(project.start_date).toLocaleDateString()} -{" "}
              {new Date(project.end_date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
