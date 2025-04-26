import PageMeta from "../../common/PageMeta";
import { Link } from "react-router";

export default function Capstone() {
  return (
    <div>
      <PageMeta
        title="Easter Egg"
        description=""
      />
      <div className=" rounded-2xl border border-gray-200 m-10 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Pakshet Kayo Lahat
          </h3>
          <Link
            to="/home"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
