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
  RotateCcw,
  ArrowDownAZ,
  ArrowUpAZ,
  Plus,
  Funnel,
  Search,
} from "lucide-react";
import axios from "axios";
import AddResourceModal from "../../../components/ui/modal/AddResourceModal/AddResourceModal";

// Define the expected structure
interface Tool {
  id: number;
  tag: string;
  name: string;
  category: string;
  status: string;
  project: string;
  location: string;
  issued_to: string;
  date_issued: string;
  date_returned: string;
  remarks: string;
  timestamp: string;
}

interface Category {
  id: number;
  category_name: string;
  category_type: string;
}

export default function ToolsAndEquipmentsTable() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter] = useState("");
  const [dataLimit, setDataLimit] = useState<number>(5); // State for data limit
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [categories, setCategories] = useState<Category[]>([]);

  const [isAscending, setIsAscending] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  const fetchTools = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/tools`)
      .then((response) => {
        setTools(response.data.tools);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tools:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTools();

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories", error);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleAddSuccess = () => {
    fetchTools();
    setIsModalOpen(false);
  };

  // Filter tools based on search, category, and status
  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.tag.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter
      ? tool.category === categoryFilter
      : true;
    const matchesStatus = statusFilter ? tool.status === statusFilter : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredTools.length / dataLimit);
  const currentTools = filteredTools.slice(
    (currentPage - 1) * dataLimit,
    currentPage * dataLimit
  );

  return (
    <div className="overflow-y-hidden rounded-xl border w-full border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Filter Controls */}
      <div className="sticky top-0 overflow-x-auto z-10 px-5 py-3 flex flex-col sm:flex-row gap-2 bg-white dark:bg-gray-800 shadow-sm">
        <Search className="absolute text-gray-300 m-2 w-auto h-5" />
        <input
          type="text"
          placeholder="           Search by name or tag"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 text-xs rounded-md w-full sm:w-1/3 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 text-xs rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Brand</option>
          <option value="Tools">Tools</option>
          <option value="Equipments">Equipments</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 text-xs rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.category_name}>
              {category.category_name}
            </option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 text-xs rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Status</option>
          <option value="Tools">Tools</option>
          <option value="Equipments">Equipments</option>
        </select>
        <button
          type="button"
          onClick={() => setIsAscending(!isAscending)}
          className="border p-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        >
          {isAscending ? (
            <ArrowDownAZ className="w-auto h-5" />
          ) : (
            <ArrowUpAZ className="w-auto h-5" />
          )}
        </button>
        <button
          type="button"
          className="border p-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        >
          <RotateCcw className="w-auto h-5" />
        </button>
        <button
          type="button"
          className="border p-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        >
          <Funnel className="w-auto h-5" />
        </button>
        <button
          onClick={handleOpenModal}
          type="button"
          className="flex items-center gap-2 px-2 text-xs rounded-md bg-white dark:bg-blue-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        >
          New
          <Plus className="w-4 h-4" />
        </button>
        <AddResourceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddSuccess={handleAddSuccess}
          resourceType="Tool"
        />
      </div>
      <div className="max-w-full overflow-x-auto">
        {/* Table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          <Table className="">
            {/* Table Header */}
            <TableHeader className="border-b border-t text-sm border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {[
                  
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-10 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-50 whitespace-nowrap"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {currentTools.length > 0 ? (
                currentTools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                      {new Date(tool.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-center">
                      <span className="block font-medium text-gray-800 text-theme-xs dark:text-white/70">
                        {tool.tag}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-center">
                      <span className="block font-medium text-gray-800 text-theme-xs dark:text-gray-400">
                        {tool.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                      {tool.category}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          tool.status === "Returned" ? "success" : "warning"
                        }
                      >
                        {tool.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-1 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                      {tool.project}
                    </TableCell>
                    <TableCell className="px-1 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                      {tool.location}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                      {new Date(tool.date_issued).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                      {tool.remarks}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                    No tools found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Data Limit Selector */}
      <div className="px-5 py-3 flex space-x-5 items-center">
        <div>
          <select
            value={dataLimit}
            onChange={(e) => setDataLimit(Number(e.target.value))}
            className="border p-2 text-xs rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-800"
          >
            <option value={10}>10 Items</option>
            <option value={50}>50 Items</option>
            <option value={10000}>All Items</option>
          </select>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-900"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-2 text-xs font-medium ${
                currentPage === index + 1
                  ? "bg-blue-700 text-white"
                  : "bg-white text-blue-700"
              } border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-800`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-900"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
