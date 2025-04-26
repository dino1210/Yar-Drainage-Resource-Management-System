import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";

// Define Consumable structure
interface Consumable {
  id: number;
  picture: string;
  tag: string;
  name: string;
  quantity: number;
  minStock: number;
  unit: string;
  location: string;
  date: string;
  status: string;
  qr: string;
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
    fetch("http://localhost:5000/api/consumables")
      .then((response) => response.json())
      .then((data) => {
        setConsumables(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching consumables", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  // Filtered data based on search and status
  const filteredConsumables = consumables.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.tag.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? item.status === statusFilter : true;

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
            placeholder="Search by name or tag"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 text-xs rounded-md w-full sm:w-1/3 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border text-xs p-2 rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border text-xs p-2 rounded-md w-full sm:w-1/4 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Unit</option>
            <option value="Available">Available</option>
            <option value="Low Stock">Low Stock</option>
          </select>
          <button
            type="button"
            className="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Consumable
          </button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="border-b text-sm border-gray-100 dark:border-gray-700">
            <TableRow>
              {[
                "Image",
                "Item Name",
                "Tag/Code",
                "Quantity",
                "Min. Stock",
                "Unit",
                "Location",
                "Date Modified",
                "Status",
                "QR Code",
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
                    <img
                      src={`http://localhost:5000/assets/images/consumables/${item.picture}`}
                      alt={`${item.name}'s Profile`}
                      className="w-16 h-16 rounded-lg object-cover cursor-pointer border border-gray-300  "
                      onClick={() =>
                        setSelectedImage(
                          `http://localhost:5000/assets/images/consumables/${item.picture}`
                        )
                      }
                    />
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-center">
                    <span className="block font-medium text-gray-800 text-theme-xs dark:text-white/70">
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-center">
                    <span className="block font-medium text-gray-800 text-theme-xs dark:text-gray-400">
                      {item.tag}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="ppx-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                    {item.minStock}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                    {item.unit}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                    {item.location}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-start dark:text-gray-400">
                    {item.date}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        item.status === "Available" ? "success" : "warning"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-xs text-center dark:text-gray-400">
                    <img
                      src={`http://localhost:5000/assets/qr/consumables/${item.qr}`}
                      alt={`${item.name}'s Profile`}
                      className="w-auto h-15 mx-auto rounded-lg object-cover cursor-pointer"
                      onClick={() => setSelectedImage(`http://localhost:5000/assets/qr/consumables/${item.qr}`)}
                    />
                  </TableCell>
                  <TableCell className="px-8 py-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                    <div className="flex items-center justify-center space-x-2 w-full h-full">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>

                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                  No consumables found
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
