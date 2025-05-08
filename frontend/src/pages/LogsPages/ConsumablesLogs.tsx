import { useState, useEffect } from "react";
import axios from "axios";  // Import Axios
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../components/common/PageMeta.tsx";

export default function ConsumablesLogs() {
  const [logs, setLogs] = useState<any[]>([]); // Initialize logs as an empty array
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);  // Loading state for API fetch
  const [error, setError] = useState<string>(""); // Error state

  useEffect(() => {
    // Fetch consumables logs from backend on component mount
    const fetchConsumablesLogs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/consumables-logs`); // API URL
        if (response.data && Array.isArray(response.data.consumablesLogs)) {
          setLogs(response.data.consumablesLogs);  // Set fetched logs to state
        } else {
          setLogs([]); // In case the response doesn't contain consumablesLogs
        }
        setLoading(false);
      } catch {
        setError("Error fetching consumables logs");  // Set error state if fetch fails
        setLogs([]); // Ensure logs are empty on error
        setLoading(false);
      }
    };

    fetchConsumablesLogs();  // Call the function to fetch logs
  }, []); // Empty dependency array to run on component mount only

  // Format the date to a readable format (e.g., 'MMM dd, yyyy')
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Filter logs based on search and status
  const filteredLogs = logs
    ? logs
        .filter(
          (log) =>
            (log.name && log.name.toLowerCase().includes(search.toLowerCase())) ||
            (log.remarks && log.remarks.toLowerCase().includes(search.toLowerCase()))
        )
        .filter((log) => statusFilter === "All" || log.status === statusFilter)
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        })
    : []; // Safeguard against undefined or null logs

  return (
    <div>
      <PageMeta title="Resource Logs: Consumables Logs" description="" />
      <PageBreadcrumb pageTitle="Consumables Logs" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-7">
        <div className="rounded-xl border w-full border-gray-200 p-4 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="sticky top-0 overflow-x-auto z-10 px-5 py-3 flex flex-col sm:flex-row gap-2 shadow-sm w-full">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by Name or Remarks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 text-xs rounded-md w-full sm:w-full bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            />
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 text-xs rounded-md w-full sm:w-full bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            >
              <option value="All">All Statuses</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Returned">Returned</option>
            </select>
            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="border p-2 text-xs rounded-md w-full sm:w-full bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            >
              <option>Sort by Date</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          {/* Table Section */}
          <div className="mt-1 overflow-x-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
            {loading ? (
              <div className="text-center py-4">Loading...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : (
              <table className="min-w-full table-auto">
                <thead className="border-b-[1px] border-gray-500">
                  <tr>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-300">Date</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-300">Name</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-300">Previous Quantity</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-300">New Quantity</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-300">Action</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-300">Action By</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-300">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700 border-b-[1px] border-gray-200 dark:border-gray-700">
                      <td className="px-5 py-4 text-center text-xs text-gray-700 dark:text-gray-300">{formatDate(log.date)}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-700 dark:text-gray-300">{log.name}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-700 dark:text-gray-300">{log.previous_quantity}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-700 dark:text-gray-300">{log.new_quantity}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-700 dark:text-gray-300">{log.action}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-700 dark:text-gray-300">{log.action_by}</td>
                      <td className="px-4 py-4 text-center text-xs text-gray-700 dark:text-gray-300">{log.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
