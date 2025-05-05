import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import {
  Search,
  ArrowDownAZ,
  ArrowUpAZ,
  RotateCcw,
  Funnel,
} from "lucide-react";
import axios from "axios";

interface VehicleLog {
  id: number;
  vehicle_name: string;
  issued_date: string;
  status: string;
  performed_by: string;
  category?: string;
  brand?: string;
}

export default function VehiclesLogsTable() {
  const [logs, setLogs] = useState<VehicleLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [dataLimit, setDataLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchLogs = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles-logs`)
      .then((response) => {
        setLogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vehicle logs:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch = log.vehicle_name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory = categoryFilter
      ? (log.category || "") === categoryFilter
      : true;
    const matchBrand = brandFilter ? (log.brand || "") === brandFilter : true;
    const matchStatus = statusFilter ? log.status === statusFilter : true;
    return matchSearch && matchCategory && matchBrand && matchStatus;
  });

  const sortedLogs = filteredLogs.sort((a, b) => {
    const dateA = new Date(a.issued_date).getTime();
    const dateB = new Date(b.issued_date).getTime();
    return isAscending ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedLogs.length / dataLimit);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * dataLimit,
    currentPage * dataLimit
  );

  if (loading)
    return (
      <p className="p-5 text-center text-sm text-gray-500 dark:text-gray-400">
        Loading...
      </p>
    );

  return (
    <div className="rounded-xl border w-full border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-900">
      <div className="sticky top-0 z-10 px-5 py-4 flex flex-wrap items-center gap-2 bg-white dark:bg-gray-800 shadow-sm">
        <div className="relative w-full sm:w-1/4">
          <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by vehicle name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 border p-2 text-xs rounded-md w-full bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="border p-2 text-xs rounded-md w-full sm:w-1/6 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="">Brand</option>
          <option value="Toyota">Toyota</option>
          <option value="Isuzu">Isuzu</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 text-xs rounded-md w-full sm:w-1/6 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="">Category</option>
          <option value="Truck">Truck</option>
          <option value="Van">Van</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 text-xs rounded-md w-full sm:w-1/6 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="">Status</option>
          <option value="Issued Out">Issued Out</option>
          <option value="Returned">Returned</option>
        </select>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setIsAscending(!isAscending)}
            className="border p-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            {isAscending ? (
              <ArrowDownAZ className="w-4 h-4" />
            ) : (
              <ArrowUpAZ className="w-4 h-4" />
            )}
          </button>
          <button className="border p-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="border p-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600">
            <Funnel className="w-4 h-4" />
          </button>
        </div>
        {/* <button
          type="button"
          className="flex items-center gap-2 px-2 py-2 text-xs rounded-md bg-blue-600 text-white"
        >
          New <Plus className="w-4 h-4" />
        </button> */}
      </div>

      <Table className="text-gray-800 dark:text-white border border-b-2">
        <TableHeader>
          <TableRow>
            <TableCell className="text-center font-semibold">Date</TableCell>
            <TableCell className="text-center font-semibold">Vehicle</TableCell>
            <TableCell className="text-center font-semibold">
              Performed By
            </TableCell>
            <TableCell className="text-center font-semibold">Status</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedLogs.length > 0 ? (
            paginatedLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-center text-xs text-gray-700 dark:text-gray-300">
                  {formatDate(log.issued_date)}
                </TableCell>
                <TableCell className="text-center text-xs text-gray-800 font-semibold dark:text-white">
                  {log.vehicle_name}
                </TableCell>
                <TableCell className="text-center text-xs text-gray-700 dark:text-gray-300">
                  {log.performed_by}
                </TableCell>
                <TableCell className="text-center text-xs">
                  <Badge
                    size="sm"
                    color={log.status === "Returned" ? "success" : "warning"}
                  >
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center text-gray-500 dark:text-gray-400 py-4"
              >
                No vehicle logs found
              </td>
            </tr>
          )}
        </TableBody>
      </Table>

      <div className="px-5 py-3 flex justify-between items-center">
        <select
          value={dataLimit}
          onChange={(e) => {
            setDataLimit(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border p-2 text-xs rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
        >
          <option value={5}>5 Items</option>
          <option value={10}>10 Items</option>
          <option value={50}>50 Items</option>
          <option value={10000}>All Items</option>
        </select>
        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-2 text-xs font-medium rounded-md border ${
                currentPage === index + 1
                  ? "bg-blue-700 text-white"
                  : "bg-white text-blue-700 dark:bg-gray-900 dark:text-white"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
