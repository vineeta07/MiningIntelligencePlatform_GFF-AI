import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import Dashboard from "./pages/Dashboard";
import EquipmentMonitoring from "./pages/EquipmentMonitoring";
import WorkerSafety from "./pages/WorkerSafety";
import Alerts from "./pages/Alerts";
import BlastSafety from "./pages/BlastSafety";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="equipment" element={<EquipmentMonitoring />} />
        <Route path="workers" element={<WorkerSafety />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="blast-safety" element={<BlastSafety />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
