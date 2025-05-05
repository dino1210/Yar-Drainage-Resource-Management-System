import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Tool {
  id: number;
  picture: string;
  name: string;
  brand: string;
  category: string;
  tag: string;
  description: string;
  purchase_date: Date;
  warranty: Date;
  status: string;
  remarks: string;
  attachments: string;
  history: string;
  qr: string;
}

export default function ToolsAndEquipmentsTable() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLimit, setDataLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesName = filterName === "" || tool.name === filterName;
    const matchesCategory =
      filterCategory === "" || tool.category === filterCategory;
    const matchesStatus = filterStatus === "" || tool.status === filterStatus;

    return matchesSearch && matchesName && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTools.length / dataLimit);
  const currentTools = filteredTools.slice(
    (currentPage - 1) * dataLimit,
    currentPage * dataLimit
  );

  const uniqueNames = Array.from(new Set(tools.map((t) => t.name)));
  const uniqueCategories = Array.from(new Set(tools.map((t) => t.category)));
  const uniqueStatuses = Array.from(new Set(tools.map((t) => t.status)));

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-600";
      case "Issued Out":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const exportCSV = () => {
    const now = new Date();
    const formattedDate = now
      .toISOString()
      .slice(0, 16)
      .replace("T", "_")
      .replace(":", "-");

    const headers = [
      "Tag/Code",
      "Tools/Equipments",
      "Brand",
      "Category",
      "Status",
      "Description",
      "Date of Purchase",
      "Warranty",
      "Remarks",
    ];

    const rows = filteredTools.map((tool) => [
      tool.tag,
      tool.name,
      tool.brand,
      tool.category,
      tool.status,
      tool.description,
      tool.purchase_date
        ? new Date(tool.purchase_date).toLocaleDateString()
        : "-",
      tool.warranty ? new Date(tool.warranty).toLocaleDateString() : "-",
      tool.remarks,
    ]);

    let csvContent = `Exported on:,${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n\n`;
    csvContent += headers.join(",") + "\n";
    csvContent += rows
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `tools_and_equipments_${formattedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const now = new Date();
    const formattedDate = now
      .toISOString()
      .slice(0, 16)
      .replace("T", "_")
      .replace(":", "-");

    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.text("Tools and Equipments Report", 14, 15);

    doc.setFontSize(10);
    doc.text(
      `Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
      14,
      22
    );

    const headers = [
      "Tag/Code",
      "Tools/Equipments",
      "Brand",
      "Category",
      "Status",
      "Description",
      "Date of Purchase",
      "Warranty",
      "Remarks",
    ];
    const rows = filteredTools.map((tool) => [
      tool.tag,
      tool.name,
      tool.brand,
      tool.category,
      tool.status,
      tool.description,
      tool.purchase_date
        ? new Date(tool.purchase_date).toLocaleDateString()
        : "-",
      tool.warranty ? new Date(tool.warranty).toLocaleDateString() : "-",
      tool.remarks,
    ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 28,
    });

    doc.save(`tools_and_equipments_${formattedDate}.pdf`);
  };

  if (loading)
    return <p className="text-center py-4 dark:text-white">Loading...</p>;

  return (
    <div className="overflow-y-hidden rounded-xl border w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      {/* Filters and Export */}
      <div className="p-4 flex flex-wrap gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800 relative">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search Name or Tag/Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md text-xs w-full sm:w-64 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="border p-2 rounded-md text-xs w-48 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Tools/Equipments</option>
            {uniqueNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border p-2 rounded-md text-xs w-48 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded-md text-xs w-48 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="border p-2 px-4 text-xs rounded-md bg-blue-500 text-white focus:ring-2 focus:ring-blue-400"
          >
            Download ▼
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={() => {
                  exportCSV();
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
              >
                Export CSV
              </button>
              <button
                onClick={() => {
                  exportPDF();
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white"
              >
                Export PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          <Table>
            <TableHeader className="border-b border-t text-xs border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-800">
              <TableRow>
                {[
                  "Tag/Code",
                  "Tools/Equipments",
                  "Brand",
                  "Category",
                  "Status",
                  "Description",
                  "Date of Purchase",
                  "Warranty",
                  "Remarks",
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-10 py-3 font-bold text-gray-800 dark:text-gray-200 text-center text-xs whitespace-nowrap"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentTools.length > 0 ? (
                currentTools.map((tool) => (
                  <TableRow
                    key={tool.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-center text-xs dark:text-gray-300">
                      {tool.tag}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-center text-xs dark:text-gray-300">
                      {tool.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-xs dark:text-gray-400">
                      {tool.brand}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-xs dark:text-gray-400">
                      {tool.category}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-xs">
                      <span
                        className={`px-3 py-1 rounded-full font-semibold ${getStatusStyles(
                          tool.status
                        )}`}
                      >
                        {tool.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-1 py-3 text-center text-xs dark:text-gray-400">
                      {tool.description}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-xs dark:text-gray-400">
                      {tool.purchase_date
                        ? new Date(tool.purchase_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-xs dark:text-gray-400">
                      {tool.warranty
                        ? new Date(tool.warranty).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-xs dark:text-gray-400">
                      {tool.remarks}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td
                    colSpan={9}
                    className="px-5 py-4 text-center text-gray-500 text-xs dark:text-gray-400"
                  >
                    No tools or equipment found
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-5 py-4 flex flex-wrap gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800">
        <select
          value={dataLimit}
          onChange={(e) => setDataLimit(Number(e.target.value))}
          className="border p-2 w-20 text-xs rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        >
          <option value={10}>10 Items</option>
          <option value={20}>20 Items</option>
          <option value={50}>50 Items</option>
          <option value={10000}>All Items</option>
        </select>

        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`border px-3 py-2 text-xs rounded-md ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
