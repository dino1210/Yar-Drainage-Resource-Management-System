import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import CheckTable from "./Tables/CheckTable"; 

export default function Check() {
  return (
    <div>
      <PageMeta
        title="Inventory Management: Check-In/Check-Out"
        description=""
      />
      <PageBreadcrumb pageTitle="Check-In/Check-Out Table" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-7">

        {/* Table Section */}
        <div className="mt-1">
          {/* Basic Table rendered here */}
          <CheckTable />
        </div>
      </div>
    </div>
  );
}
