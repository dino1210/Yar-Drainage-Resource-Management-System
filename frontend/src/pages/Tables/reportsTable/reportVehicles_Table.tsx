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
import AddResourceModal from "../../../components/ui/modal/AddResourceModal/AddResourceModal";
import { ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Vehicles {
  id: number;
  picture: string;
  name: string;
  brand: string;
  plate_no: string;
  category: string;
  fuel_type: string;
  location: string;
  acquisition_date: string;
  warranty: string;
  status: string;
  remarks: string;
  maintenance_due: string;
  assigned_driver: string;
  attachment: string;
  qr: string;
}

export default function VehiclesTable() {
  const [vehicles, setVehicles] = useState<Vehicles[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataLimit, setDataLimit] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const fetchVehicles = () => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles`)
      .then((response) => {
        setVehicles(response.data.vehicles);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching vehicles:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  if (loading) return <p>Loading...</p>;

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.plate_no.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? vehicle.category === categoryFilter
      : true;
    const matchesFuelType = fuelTypeFilter
      ? vehicle.fuel_type === fuelTypeFilter
      : true;
    const matchesStatus = statusFilter ? vehicle.status === statusFilter : true;
    const matchesLocation = locationFilter
      ? vehicle.location === locationFilter
      : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesFuelType &&
      matchesStatus &&
      matchesLocation
    );
  });

  const totalPages = Math.ceil(filteredVehicles.length / dataLimit);
  const currentVehicles = filteredVehicles.slice(
    (currentPage - 1) * dataLimit,
    currentPage * dataLimit
  );

  const handleAddSuccess = () => {
    fetchVehicles();
    setIsModalOpen(false);
  };

  const uniqueCategories = Array.from(new Set(vehicles.map((v) => v.category)));
  const uniqueFuelTypes = Array.from(new Set(vehicles.map((v) => v.fuel_type)));
  const uniqueStatuses = Array.from(new Set(vehicles.map((v) => v.status)));
  const uniqueLocations = Array.from(new Set(vehicles.map((v) => v.location)));

  const getCurrentDateTime = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}_${String(
      now.getHours()
    ).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}-${String(
      now.getSeconds()
    ).padStart(2, "0")}`;
  };

  const getCurrentDateTimeReadable = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  const formatValue = (value: string | null | undefined) => {
    if (!value || value.trim() === "") return "-";
    return value.includes(",") ? `"${value}"` : value;
  };

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Brand",
      "Plate No.",
      "Category",
      "Fuel Type",
      "Location",
      "Acquisition Date",
      "Warranty",
      "Status",
      "Remarks",
      "Maintenance Due",
      "Assigned Driver",
    ];

    const rows = filteredVehicles.map((vehicle) => [
      formatValue(vehicle.name),
      formatValue(vehicle.brand),
      formatValue(vehicle.plate_no),
      formatValue(vehicle.category),
      formatValue(vehicle.fuel_type),
      formatValue(vehicle.location),
      new Date(vehicle.acquisition_date).toLocaleDateString(),
      new Date(vehicle.warranty).toLocaleDateString(),
      formatValue(vehicle.status),
      formatValue(vehicle.remarks),
      formatValue(vehicle.maintenance_due),
      formatValue(vehicle.assigned_driver),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `vehicles_report_${getCurrentDateTime()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const dateTime = getCurrentDateTimeReadable();

    doc.setFontSize(16);
    doc.text(`Vehicles Report  ${dateTime}`, 14, 15);

    const tableColumn = [
      "Name",
      "Brand",
      "Plate No.",
      "Category",
      "Fuel Type",
      "Location",
      "Acquisition Date",
      "Warranty",
      "Status",
      "Remarks",
      "Maintenance Due",
      "Assigned Driver",
    ];

    const tableRows = filteredVehicles.map((vehicle) => [
      vehicle.name,
      vehicle.brand,
      vehicle.plate_no,
      vehicle.category,
      vehicle.fuel_type,
      vehicle.location,
      new Date(vehicle.acquisition_date).toLocaleDateString(),
      new Date(vehicle.warranty).toLocaleDateString(),
      vehicle.status,
      vehicle.remarks,
      vehicle.maintenance_due,
      vehicle.assigned_driver,
    ]);

    autoTable(doc, {
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`vehicles_report_${getCurrentDateTime()}.pdf`);
  };

  return (
    <div className="overflow-y-hidden rounded-xl border w-full border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] text-gray-500 text-center dark:text-gray-50 whitespace-nowrap text-xs">
      <div className="px-5 py-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Filters */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name or Plate No."
            className="border p-2 text-xs rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border p-2 text-xs w-36 rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={fuelTypeFilter}
            onChange={(e) => setFuelTypeFilter(e.target.value)}
            className="border p-2 text-xs w-36 rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
          >
            <option value="">All Fuel Types</option>
            {uniqueFuelTypes.map((fuel) => (
              <option key={fuel} value={fuel}>
                {fuel}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 text-xs w-36 rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
          >
            <option value="">All Status</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border p-2 text-xs w-36 rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600"
          >
            <option value="">All Locations</option>
            {uniqueLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Download Buttons */}
        <div className="relative">
          <button
            onClick={() => setIsDownloadOpen(!isDownloadOpen)}
            className="flex items-center gap-1 px-3 py-2 border rounded-md text-xs bg-blue-600 text-white dark:bg-blue-500 dark:text-white dark:border-gray-600"
          >
            Download <ChevronDown size={16} />
          </button>

          {isDownloadOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded-md shadow-md z-10 flex flex-col">
              <button
                onClick={handleExportPDF}
                className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="w-full text-left px-4 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Export CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-t text-xs border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {[
                "Name",
                "Brand",
                "Plate No.",
                "Category",
                "Fuel Type",
                "Location",
                "Acquisition Date",
                "Warranty",
                "Status",
                "Remarks",
                "Maintenance Due",
                "Assigned Driver",
              ].map((header, index) => (
                <TableCell
                  key={index}
                  isHeader
                  className="px-6 py-3 font-medium text-gray-500 text-center text-xs dark:text-gray-50 whitespace-nowrap"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
            {currentVehicles.length > 0 ? (
              currentVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="px-4 py-3 text-center">
                    {vehicle.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {vehicle.brand}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {vehicle.plate_no}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {vehicle.category}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {vehicle.fuel_type}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {vehicle.location}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {new Date(vehicle.acquisition_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {new Date(vehicle.warranty).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Badge
                      size="sm"
                      color={
                        vehicle.status === "Available" ? "success" : "info"
                      }
                    >
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {vehicle.remarks || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {vehicle.maintenance_due}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    {vehicle.assigned_driver || "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={12}
                  className="px-5 py-4 text-center text-gray-500 text-xs dark:text-gray-400"
                >
                  No Vehicles found
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-5 flex space-x-5 items-center text-xs">
        <select
          value={dataLimit}
          onChange={(e) => setDataLimit(Number(e.target.value))}
          className="border p-2.5 w-20 text-xs rounded-md bg-white dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
        >
          <option value={10}>10 Items</option>
          <option value={20}>20 Items</option>
          <option value={50}>50 Items</option>
          <option value={9999}>All Items</option>
        </select>

        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
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
              } border rounded-md`}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="border px-3 py-2 text-xs rounded-md bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            &gt;
          </button>
        </div>
      </div>

      <AddResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSuccess={handleAddSuccess}
        resourceType="Vehicle"
      />
    </div>
  );
}
