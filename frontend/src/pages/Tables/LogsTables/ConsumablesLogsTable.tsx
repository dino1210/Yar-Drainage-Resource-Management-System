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
  Plus,
} from "lucide-react";
import axios from "axios";

interface ConsumableLog {
  id: number;
  consumable_name: string;
  issued_date: string;
  status: string;
  performed_by: string;
  category?: string;
  brand?: string;
}

export default function ConsumablesLogsTable() {
  const [logs, setLogs] = useState<ConsumableLog[]>([]);
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
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/consumables-logs`)
      .then((response) => {
        setLogs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching consumable logs:", error);
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
    const matchSearch = log.consumable_name
      .toLowerCase()
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
    <div className="rounded-2xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-gray-900 shadow-lg">
      {/* Filters */}
      <div className="sticky top-0 z-10 px-6 py-4 flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="relative w-full sm:w-1/4">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 text-sm rounded-md w-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600"
          />
        </div>

        {[
          {
            label: "Brand",
            value: brandFilter,
            onChange: setBrandFilter,
            options: ["SampleBrand"],
          },
          {
            label: "Category",
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: ["Chemical"],
          },
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: ["Issued Out", "Returned"],
          },
        ].map(({ label, value, onChange, options }) => (
          <select
            key={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border px-3 py-2 text-sm rounded-md w-full sm:w-1/6 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="">{label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ))}

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setIsAscending(!isAscending)}
            className="border p-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-white border-gray-300 dark:border-gray-600"
          >
            {isAscending ? (
              <ArrowDownAZ className="w-4 h-4" />
            ) : (
              <ArrowUpAZ className="w-4 h-4" />
            )}
          </button>
          <button className="border p-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-white border-gray-300 dark:border-gray-600">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="border p-2 rounded-md bg-white dark:bg-gray-800 text-gray-600 dark:text-white border-gray-300 dark:border-gray-600">
            <Funnel className="w-4 h-4" />
          </button>
        </div>

        {/* <button
          type="button"
          className="ml-auto flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          New <Plus className="w-4 h-4" />
        </button> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="text-center font-bold">Date</TableCell>
              <TableCell className="text-center font-bold">
                Consumable
              </TableCell>
              <TableCell className="text-center font-bold">
                Performed By
              </TableCell>
              <TableCell className="text-center font-bold">Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="text-center text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(log.issued_date)}
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium text-gray-900 dark:text-white">
                    {log.consumable_name}
                  </TableCell>
                  <TableCell className="text-center text-sm text-gray-700 dark:text-gray-300">
                    {log.performed_by}
                  </TableCell>
                  <TableCell className="text-center text-sm">
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
                  No consumables found
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex justify-between items-center border-t dark:border-gray-700">
        <select
          value={dataLimit}
          onChange={(e) => {
            setDataLimit(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
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
            className="border px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-2 text-sm font-medium rounded-md border ${
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
            className="border px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
