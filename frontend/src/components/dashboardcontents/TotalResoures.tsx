import { useEffect, useState } from "react";
import { Car, Drill, PaintBucket } from "lucide-react";
import { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
}

export default function EcommerceMetrics() {
  const [metrics, setMetrics] = useState({
    totalTools: 0,
    totalConsumables: 0,
    totalVehicles: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/metrics`);
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* Tools */}
      <MetricCard
        icon={<Drill className="text-gray-800 size-6 dark:text-white/90" />}
        label="Total Tools"
        value={metrics.totalTools}
      />
      {/* Consumables */}
      <MetricCard
        icon={<PaintBucket className="text-gray-800 size-6 dark:text-white/90" />}
        label="Total Consumables"
        value={metrics.totalConsumables}
      />
      {/* Vehicles */}
      <MetricCard
        icon={<Car className="text-gray-800 size-6 dark:text-white/90" />}
        label="Total Vehicles"
        value={metrics.totalVehicles}
      />
    </div>
  );
}

function MetricCard({ icon, label, value } : MetricCardProps ) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        {icon}
      </div>
      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{value}</h4>
        </div>
      </div>
    </div>
  );
}
