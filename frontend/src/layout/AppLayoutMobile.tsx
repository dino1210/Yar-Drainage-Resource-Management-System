import { SidebarProvider } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeaderMobile from "./AppHeaderMobile";
import Backdrop from "./Backdrop";

const LayoutContent: React.FC = () => {

  return (
    <div className="min-h-screen">
      <div>
        <Backdrop />
      </div>
        <AppHeaderMobile />
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
          <Outlet />
        </div>
      </div>
  );
};

const AppLayoutMobile: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayoutMobile;
