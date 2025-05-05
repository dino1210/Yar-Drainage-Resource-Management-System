import ComponentCard from "../../components/common/ComponentCard";
import BarChartOne from "../../components/charts/bar/BarChartOne";


export default function BarChart() {
  return (
    <div>
      <div className="space-y-6">
        <ComponentCard title="">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
