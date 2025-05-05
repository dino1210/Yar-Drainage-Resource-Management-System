// src/pages/ModeSelector.tsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { QrCode, LayoutDashboard } from "lucide-react";

const ModeSelector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Select Mode";
  }, []);

  const handleSelect = (mode: "scanner" | "dashboard") => {
    if (mode === "scanner") {
      navigate("/mobile-home");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="flex justify-center items-center mt-9 px-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] w-full max-w-4xl xl:p-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white/90">
            Select Mode
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Mobile Scanner Card */}
          <div
            onClick={() => handleSelect("scanner")}
            className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-center w-14 h-14 mx-auto bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
              <QrCode className="text-gray-800 dark:text-white/90 size-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white/90">Mobile Scanner</h2>
          </div>

          {/* Dashboard Card */}
          <div
            onClick={() => handleSelect("dashboard")}
            className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="flex items-center justify-center w-14 h-14 mx-auto bg-gray-100 rounded-xl dark:bg-gray-800 mb-4">
              <LayoutDashboard className="text-gray-800 dark:text-white/90 size-6" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white/90">Inventory System</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
