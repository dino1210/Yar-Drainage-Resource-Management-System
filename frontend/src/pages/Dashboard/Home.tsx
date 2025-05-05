import MonthlySalesChart from "../../components/dashboardcontents/MonthlySalesChart";
import RecentOrders from "../../components/dashboardcontents/RecentOrders";
import PageMeta from "../../components/common/PageMeta";
import StatisticsChart from "../../components/dashboardcontents/StatisticsChart";
import TotalResources from "../../components/dashboardcontents/TotalResoures";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Dashboard"
        description=""
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <TotalResources />
          <StatisticsChart />
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5 max-h-full">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
