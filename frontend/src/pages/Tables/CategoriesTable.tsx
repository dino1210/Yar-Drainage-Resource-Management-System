import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Pencil, Trash2, CircleOff, Plus } from "lucide-react";

// Define Consumable structure
interface Consumable {
    id: number;
    category_type: string;
    category_name: string;
}

export default function ConsumablesLogsTable() {
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [dataLimit, setDataLimit] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setConsumables(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  // Filtered data based on search and status
  const filteredConsumables = consumables.filter((item) => {
    const matchesSearch =
      item.category_type.toLowerCase().includes(search.toLowerCase()) ||
      item.category_name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? item.category_type === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredConsumables.length / dataLimit);
  const currentConsumables = filteredConsumables.slice(
    (currentPage - 1) * dataLimit,
    currentPage * dataLimit
  );

  const handleEdit = (toolId: number) => {
    console.log("Edit user with ID:", toolId);
  };

  const handleDelete = (toolId: number) => {
    console.log("Delete user with ID:", toolId);
  };

  return (
    <div className="overflow-hidden rounded-xl border w-[62rem] border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        {/* Search and Filters */}
        <div className="border-b border-gray-100 dark:border-gray-700 px-5 py-3 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by category name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 text-xs rounded-md w-full sm:w-1/3 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border text-xs p-2 rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Category Type</option>
            <option value="Tools And Equipments">Tools And Equipments</option>
            <option value="Consumables">Consumables</option>
            <option value="Vehicles">Vehicles</option>
          </select>
          <button
          type="button"
          className="flex items-center gap-2 px-2 text-xs rounded-md bg-white dark:bg-blue-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        >
          New
          <Plus className="w-4 h-4" />
        </button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="border-b text-sm border-gray-100 dark:border-gray-700">
            <TableRow>
              {[
                "Category Type",
                "Category Name",
                "Actions",
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
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {currentConsumables.length > 0 ? (
              currentConsumables.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-center">
                    <span className="block font-medium text-gray-800 text-theme-xs dark:text-white/70">
                      {item.category_type}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-center">
                    <span className="block font-medium text-gray-800 text-theme-xs dark:text-gray-400">
                      {item.category_name}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 py-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                    <div className="flex items-center justify-center space-x-2 w-full h-full">
                    <button
                        onClick={() => handleEdit(item.id)}
                        className="px-3 py-1 text-xs font-medium text-blue-900 bg-blue-600 bg-opacity-70 rounded-lg hover:bg-blue-900"
                        title="Edit"
                      >
                        <Pencil className="w-3 h-7"/>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-red-800 rounded-lg hover:bg-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-7"/>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-orange-800 rounded-lg hover:bg-orange-900"
                        title="Disable"
                      >
                        <CircleOff className="w-3 h-7"/>
                      </button>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-5 py-4 text-start text-red-500 dark:text-red-400">
                  Error Fetching Categories
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Data Limit Selector */}
        <div className="px-5 py-3 flex space-x-5 items-center">
        <div>
            <select
              value={dataLimit}
              onChange={(e) => setDataLimit(Number(e.target.value))}
              className="border p-2 text-xs rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-800"
            >
              <option value={10}>10 Items</option>
              <option value={20}>20 Items</option>
              <option value={50}>50 Items</option>
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
                className={`px-3 py-2 text-xs font-medium ${currentPage === index + 1 ? "bg-blue-700 text-white" : "bg-white text-blue-700"} border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-800`}
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

          {/* Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center mt-5 justify-center z-50"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Full Size"
                  className="w-[250px] h-[250px] object-cover rounded-lg"
                />
                {/* Close Button */}
                <button
                  className="absolute top-0 right-0 bg-white bg-opacity-20 text-black p-2 rounded-full hover:bg-gray-300"
                  onClick={() => setSelectedImage(null)}
                >
                  ✕
                </button>
              </div>
            </div>

          )}


        </div>
      </div>
    </div>
  );
}
