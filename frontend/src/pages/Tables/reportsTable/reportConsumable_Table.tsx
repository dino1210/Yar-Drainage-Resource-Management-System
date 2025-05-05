import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

interface Consumable {
  id: number;
  tag: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  location: string;
  status: string;
}

export default function ConsumablesTable() {
  const [consumables, setConsumables] = useState<Consumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLimit, setDataLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");

  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const fetchConsumables = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/consumables`)
      .then((response) => {
        setConsumables(response.data.consumables);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching consumables:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchConsumables();
  }, []);

  if (loading) return <p className="text-sm">Loading...</p>;

  const filteredConsumables = consumables.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      matchesSearch &&
      (categoryFilter ? item.category === categoryFilter : true) &&
      (statusFilter ? item.status === statusFilter : true) &&
      (locationFilter ? item.location === locationFilter : true)
    );
  });

  const totalPages = Math.ceil(filteredConsumables.length / dataLimit);

  const currentConsumables = filteredConsumables.slice(
    (currentPage - 1) * dataLimit,
    currentPage * dataLimit
  );

  const getStatusColor = (status: string) => {
    if (status === "In Stock") return "info";
    if (status === "Available") return "success";
    if (status === "Low Stock") return "warning";
    return "error";
  };

  const uniqueCategories = Array.from(
    new Set(consumables.map((c) => c.category))
  );
  const uniqueStatuses = Array.from(new Set(consumables.map((c) => c.status)));
  const uniqueLocations = Array.from(
    new Set(consumables.map((c) => c.location))
  );

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const now = new Date();
    const formattedDate = now.toLocaleString();

    doc.setFontSize(12);
    doc.text("Consumables Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${formattedDate}`, 14, 22);

    const tableColumn = [
      "Item Name",
      "Tag/Code",
      "Category",
      "Quantity",
      "Unit",
      "Min. Stock",
      "Location",
      "Status",
    ];
    const tableRows: any[] = [];

    filteredConsumables.forEach((item) => {
      const rowData = [
        item.name,
        item.tag,
        item.category,
        item.quantity,
        item.unit,
        item.minStock,
        item.location,
        item.status,
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      startY: 28,
    });

    doc.save("consumables_report.pdf");
  };

  const exportCSV = () => {
    const now = new Date();
    const formattedDate = now.toLocaleString();

    const headerInfo = [
      "Consumables Report",
      `Generated on: ${formattedDate}`,
      "",
    ];
    const csvHeader = [
      "Item Name,Tag/Code,Category,Quantity,Unit,Min. Stock,Location,Status",
    ];
    const csvRows = filteredConsumables.map((item) =>
      [
        item.name,
        item.tag,
        item.category,
        item.quantity,
        item.unit,
        item.minStock,
        item.location,
        item.status,
      ]
        .map((field) => `"${field}"`)
        .join(",")
    );
    const csvContent = [...headerInfo, ...csvHeader, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "consumables_report.csv");
  };

  return (
    <div className="overflow-y-hidden rounded-xl border w-full border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex flex-wrap gap-4 p-5 items-center">
        {/* 🔍 Search bar */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search Item Name or Tag Code"
          className="border p-2 text-sm rounded-md min-w-[250px] bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
        />

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 text-sm rounded-md min-w-[200px] bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 text-sm rounded-md min-w-[200px] bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map((stat, idx) => (
            <option key={idx} value={stat}>
              {stat}
            </option>
          ))}
        </select>

        {/* Location filter */}
        <select
          value={locationFilter}
          onChange={(e) => {
            setLocationFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 text-sm rounded-md min-w-[160px] bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Export dropdown */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowExportDropdown((prev) => !prev)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-xs"
          >
            Download ▼
          </button>

          {showExportDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10 flex flex-col">
              <button
                onClick={() => {
                  exportPDF();
                  setShowExportDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export PDF
              </button>
              <button
                onClick={() => {
                  exportCSV();
                  setShowExportDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
          <Table>
            <TableHeader className="border-b border-t text-sm font-bold bg-gray-100 dark:bg-gray-800 dark:text-white border-gray-200 dark:border-white/[0.1]">
              <TableRow>
                {[
                  "Item Name",
                  "Tag/Code",
                  "Category",
                  "Quantity",
                  "Unit",
                  "Min. Stock",
                  "Location",
                  "Status",
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className="px-6 py-3 text-center font-bold text-sm text-gray-800 dark:text-white"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {currentConsumables.length > 0 ? (
                currentConsumables.map((consumable) => (
                  <TableRow key={consumable.id}>
                    <TableCell className="px-5 py-3 sm:px-6 text-center font-normal text-sm dark:text-white">
                      {consumable.name}
                    </TableCell>
                    <TableCell className="px-5 py-3 sm:px-6 text-center text-gray-500 text-sm">
                      {consumable.tag}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-gray-500 text-sm">
                      {consumable.category}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-gray-500 text-sm">
                      {consumable.quantity}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-gray-500 text-sm">
                      {consumable.unit}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-gray-500 text-sm">
                      {consumable.minStock}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center text-gray-500 text-sm">
                      {consumable.location}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Badge
                        size="sm"
                        color={getStatusColor(consumable.status)}
                      >
                        <span className="text-sm">{consumable.status}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td
                    colSpan={8}
                    className="px-5 py-4 text-center text-gray-500 text-sm dark:text-gray-400"
                  >
                    No consumables found
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 flex space-x-5 items-center">
        <select
          value={dataLimit}
          onChange={(e) => {
            setDataLimit(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border p-1 w-20 text-xs rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400 dark:hover:bg-gray-800"
        >
          <option value={10}>10 Items</option>
          <option value={20}>20 Items</option>
          <option value={50}>50 Items</option>
          <option value={9999}>All Items</option>
        </select>

        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="border px-2 py-1 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-50"
          >
            &lt;
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-2 py-1 text-xs font-medium ${
                currentPage === index + 1
                  ? "bg-blue-700 text-white"
                  : "bg-white text-blue-700"
              } border rounded-md`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="border px-2 py-1 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
