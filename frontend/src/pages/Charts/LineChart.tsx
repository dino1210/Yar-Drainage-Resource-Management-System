import ComponentCard from "../../components/common/ComponentCard";
import LineChartOne from "../../components/charts/line/LineChartOne";

export default function LineChart() {
  return (
    <>
      <div className="space-y-6">
        <ComponentCard title="">
          <LineChartOne />
        </ComponentCard>
      </div>
    </>
  );
}
