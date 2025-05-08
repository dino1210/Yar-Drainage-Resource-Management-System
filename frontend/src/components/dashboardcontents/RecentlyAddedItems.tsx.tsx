import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";

interface Activity {
  id: number;
  name: string;
  tag: string;
  action: string;
  actionBy: string;
  date: string;
}

export default function RecentlyAddedItems() {
  const [activities, setActivities] = useState<Activity[]>([]); // State for storing fetched activities
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from multiple API endpoints
        const [toolLogs, consumableLogs, vehicleLogs, projectLogs] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tool-logs`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/consumable-logs`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vehicle-logs`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects/recent`)
        ]);

        // Combine all fetched logs into a single array
        const combinedData = [
          ...toolLogs.data,
          ...consumableLogs.data,
          ...vehicleLogs.data,
          ...projectLogs.data
        ];

        // Set the combined data to the state
        setActivities(combinedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only on component mount

  return (
    <div className="overflow-hidden h-full rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Recent Activities</h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Item</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Action By</TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Date</TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <TableRow>
                <TableCell className="text-center py-4">Loading...</TableCell>
              </TableRow>
            ) : (
              activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{activity.tag}</TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{activity.action}</TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{activity.actionBy}</TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">{new Date(activity.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
