import { useEffect, useState, ReactNode } from "react";
import { Car, Drill, PaintBucket } from "lucide-react";
import { Link } from "react-router-dom";

interface BreakdownItem {
  label: string;
  value: number;
}

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  to: string;
  breakdown?: BreakdownItem[];
}

export default function EcommerceMetrics() {
  const [metrics, setMetrics] = useState({
    totalTools: 0,
    availableTools: 0,
    issuedTools: 0,
    reservedTools: 0,

    totalVehicles: 0,
    availableVehicles: 0,
    issuedVehicles: 0,
    reservedVehicles: 0,

    totalConsumables: 0,
    inStockConsumables: 0,
    lowStockConsumables: 0,
    noStockConsumables: 0,
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
        to="/tools"
        breakdown={[
          { label: "Available", value: metrics.availableTools },
          { label: "Issued Out", value: metrics.issuedTools },
          { label: "Reserved Tools", value: metrics.reservedTools },
        ]}
      />

      {/* Consumables */}
      <MetricCard
        icon={<PaintBucket className="text-gray-800 size-6 dark:text-white/90" />}
        label="Total Consumables"
        value={metrics.totalConsumables}
        to="/consumables"
        breakdown={[
          { label: "In Stock", value: metrics.inStockConsumables },
          { label: "Low Stock", value: metrics.lowStockConsumables },
          { label: "No Stock", value: metrics.noStockConsumables },
        ]}
      />

      {/* Vehicles */}
      <MetricCard
        icon={<Car className="text-gray-800 size-6 dark:text-white/90" />}
        label="Total Vehicles"
        value={metrics.totalVehicles}
        to="/vehicles"
        breakdown={[
          { label: "Available", value: metrics.availableVehicles },
          { label: "Issued Out", value: metrics.issuedVehicles },
          { label: "Reserved", value: metrics.reservedVehicles },
        ]}
      />
    </div>
  );
}

function MetricCard({ icon, label, value, to, breakdown }: MetricCardProps) {
  return (
    <Link to={to}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 hover:shadow-lg transition">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          {icon}
        </div>
        <div className="mt-5 space-y-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <h4 className="text-lg font-bold text-gray-800 dark:text-white/90">{value}</h4>

          {breakdown?.map((item, index) => (
            <div key={index} className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
