import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ConsumablesTable from "../Tables/LogsTables/ConsumablesLogsTable"; 

export default function ConsumablesLogs() {
  return (
    <div>
      <PageMeta
        title="Resource Logs: Consumables Logs"
        description=""
      />
      <PageBreadcrumb pageTitle="Consumables Logs" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-7">

        {/* Table Section */}
        <div className="mt-1">
          {/* Basic Table rendered here */}
          <ConsumablesTable />
        </div>
      </div>
    </div>
  );
}
