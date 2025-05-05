import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import CategoriesTable from "./Tables/CategoriesTable"; 

export default function Categories() {
  return (
    <div>
      <PageMeta
        title="Inventory Management: Categories"
        description=""
      />
      <PageBreadcrumb pageTitle="Categories Table" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-7">

        {/* Table Section */}
        <div className="mt-1">
          {/* Basic Table rendered here */}
          <CategoriesTable />
        </div>
      </div>
    </div>
  );
}
