import { useState } from "react";
import { Drill, FlaskConical, Car } from "lucide-react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ReportConsumableTable from "../pages/Tables/reportsTable/reportConsumable_Table";
import ReportToolTable from "../pages/Tables/reportsTable/reportTools_Table";
import ReportVehicleTable from "../pages/Tables/reportsTable/reportVehicles_Table";

export default function Reports() {
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "tools" | "consumables" | "vehicles"
  >("all");

  return (
    <div className=" bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black min-h-screen">
      <PageMeta
        title="Reports"
        description="Generated reports of system activities"
      />
      <PageBreadcrumb pageTitle="Reports" />

      {/* Filter Dropdown */}
      <div className="w-full max-w-6xl mx-auto mb-8 flex justify-end">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value as any)}
          className="rounded-lg border border-gray-300 bg-white p-3 text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="all">All Tables</option>
          <option value="tools">Tools & Equipment</option>
          <option value="consumables">Consumables Report</option>
          <option value="vehicles">Vehicles Report</option>
        </select>
      </div>

      <div className="w-full max-w-6xl mx-auto space-y-12">
        {(selectedFilter === "all" || selectedFilter === "tools") && (
          <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-md p-10 shadow-2xl dark:border-gray-700 dark:bg-gray-900/80 transition-all">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3">
              <Drill size={30} className="text-gray-600 dark:text-gray-300" />
              Tools & Equipment Report
            </h2>
            <ReportToolTable />
          </div>
        )}

        {(selectedFilter === "all" || selectedFilter === "consumables") && (
          <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-md p-10 shadow-2xl dark:border-gray-700 dark:bg-gray-900/80 transition-all">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3">
              <FlaskConical
                size={30}
                className="text-gray-600 dark:text-gray-300"
              />
              Consumables Report
            </h2>
            <ReportConsumableTable />
          </div>
        )}

        {(selectedFilter === "all" || selectedFilter === "vehicles") && (
          <div className="rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-md p-10 shadow-2xl dark:border-gray-700 dark:bg-gray-900/80 transition-all">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-3">
              <Car size={30} className="text-gray-600 dark:text-gray-300" />
              Vehicles Report
            </h2>
            <ReportVehicleTable />
          </div>
        )}
      </div>
    </div>
  );
}
