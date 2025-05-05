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
  ArrowDownAZ,
  ArrowUpAZ,
  Funnel,
  RotateCcw,
  Search,
} from "lucide-react";
import axios from "axios";
import AddResourceModal from "../../../components/ui/modal/AddResourceModal/AddResourceModal";

interface Tool {
  id: number;
  tool_name: string;
  issued_date: string;
  status: string;
  performed_by: string;
  category?: string;
  brand?: string;
}

export default function ToolsAndEquipmentsTable() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataLimit, setDataLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/tools/logs`
      );
      if (response.data && Array.isArray(response.data)) {
        setTools(response.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setTools([]);
      }
    } catch (error) {
      console.error("Error fetching tools:", error);
      setTools([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleAddSuccess = () => {
    fetchTools();
    setIsModalOpen(false);
  };

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

  const filteredTools = (tools || []).filter((tool) => {
    const matchSearch = tool.tool_name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchCategory = categoryFilter
      ? tool.category === categoryFilter
      : true;
    const matchBrand = brandFilter ? tool.brand === brandFilter : true;
    const matchStatus = statusFilter ? tool.status === statusFilter : true;
    return matchSearch && matchCategory && matchBrand && matchStatus;
  });

  const sortedTools = filteredTools.sort((a, b) => {
    const dateA = new Date(a.issued_date).getTime();
    const dateB = new Date(b.issued_date).getTime();
    return isAscending ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedTools.length / dataLimit);
  const paginatedTools = sortedTools.slice(
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
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 py-4 flex flex-wrap items-center gap-2 bg-white dark:bg-gray-800 shadow-sm">
        <div className="relative w-full sm:w-1/4">
          <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by tool name"
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
          <option value="Makita">Makita</option>
          <option value="Bosch">Bosch</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 text-xs rounded-md w-full sm:w-1/6 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          <option value="">Category</option>
          <option value="Drill">Drill</option>
          <option value="Grinder">Grinder</option>
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
            type="button"
            onClick={() => setIsAscending(!isAscending)}
            className="border p-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            {isAscending ? (
              <ArrowDownAZ className="w-4 h-4" />
            ) : (
              <ArrowUpAZ className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            className="border p-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="border p-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <Funnel className="w-4 h-4" />
          </button>
        </div>

        <AddResourceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddSuccess={handleAddSuccess}
          resourceType="Tool"
        />
      </div>

      {/* Table */}
      <Table className="text-gray-600 dark:text-white m-5">
        <TableHeader>
          <TableRow>
            <TableCell className="text-center font-semibold">Date</TableCell>
            <TableCell className="text-center font-semibold">
              Tool Name
            </TableCell>
            <TableCell className="text-center font-semibold">
              Performed By
            </TableCell>
            <TableCell className="text-center font-semibold">Status</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTools.length > 0 ? (
            paginatedTools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell className="text-center text-xs text-gray-700 dark:text-gray-300">
                  {formatDate(tool.issued_date)}
                </TableCell>
                <TableCell className="text-center text-xs text-gray-800 font-semibold dark:text-white">
                  {tool.tool_name}
                </TableCell>
                <TableCell className="text-center text-xs text-gray-700 dark:text-gray-300">
                  {tool.performed_by}
                </TableCell>
                <TableCell className="text-center text-xs">
                  <Badge
                    size="sm"
                    color={tool.status === "Returned" ? "success" : "warning"}
                  >
                    {tool.status}
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
                No Tools and Equipment found
              </td>
            </tr>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
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
