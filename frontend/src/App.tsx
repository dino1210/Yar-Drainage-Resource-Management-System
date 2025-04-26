import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Capstone from "./components/ui/videos/Capstone";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Login from "./pages/AuthPages/Login";
import Check from "./pages/Check";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";
import Projects from "./pages/Projects";
import UserManagement from "./pages/UserManagement";
import Settings from "./pages/Settings";
import ToolsAndEquipments from "./pages/ToolsAndEquipments";
import Consumables from "./pages/Consumables";
import Vehicles from "./pages/Vehicles";
import ToolsAndEquipmentsLogs from "./pages/LogsPages/ToolsAndequipmentsLogs";
import ConsumablesLogs from "./pages/LogsPages/ConsumablesLogs";
import VehiclesLogs from "./pages/LogsPages/VehiclesLogs";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import RoleBasedRoute from "./components/auth/RolebasedRoutes";
import ModeSelector from "./pages/OtherPage/ModeSelector";
import AppLayoutMobile from "./layout/AppLayoutMobile";
import HomeMobile from "./pages/Mobile/HomeMobile";
import CreateProject from "./pages/Mobile/CreateProject";

export default function App() {
  return (
    <>
      <div className="">
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Layout */}
            <Route path="/" element={<Login />} />

            {/* Mobile */}
            <Route element={<AppLayoutMobile />}>
              <Route
                path="/select-mode"
                element={
                  <ProtectedRoute>
                    <ModeSelector />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mobile-home"
                element={
                  <ProtectedRoute>
                    <HomeMobile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-project"
                element={
                  <ProtectedRoute>
                    <CreateProject />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route element={<AppLayout />}>
              <Route
                index
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              {/* Others Page */}
              <Route path="/check" element={<Check />} />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <RoleBasedRoute allowedRoles={["Admin", "Manager"]}>
                    <Reports />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <RoleBasedRoute allowedRoles={["Admin", "Manager"]}>
                    <Projects />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/usermanagement"
                element={
                  <RoleBasedRoute allowedRoles={["Admin"]}>
                    <UserManagement />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools"
                element={
                  <ProtectedRoute>
                    <ToolsAndEquipments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/consumables"
                element={
                  <ProtectedRoute>
                    <Consumables />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vehicles"
                element={
                  <ProtectedRoute>
                    <Vehicles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/consumables-logs"
                element={
                  <ProtectedRoute>
                    <ConsumablesLogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools-logs"
                element={
                  <ProtectedRoute>
                    <ToolsAndEquipmentsLogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vehicles-logs"
                element={
                  <ProtectedRoute>
                    <VehiclesLogs />
                  </ProtectedRoute>
                }
              />

              {/* Forms */}
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* Ui Elements */}
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/images" element={<Images />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/bar-chart" element={<BarChart />} />
            </Route>

            {/* Auth Layout */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
            <Route path="/capstone" element={<Capstone />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}
