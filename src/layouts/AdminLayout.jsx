import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/AdminLayout.css";
import Navbar from "./components/Navbar";
import SidebarAdmin from "./components/SidebarAdmin";
import Footer from "./components/Footer";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, rolActivo, logout, switchRol } = useAuth();
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  };

  const handleSwitchRole = () => {
    switchRol();
    navigate("/select-rol", { replace: true });
  };

  const handleViewProfile = () => {
    navigate("/admin/perfil");
  };

  return (
    <div className="admin-layout">
      <Navbar
        className="no-print"
        onToggleSidebar={handleToggleSidebar}
        role="admin"
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onViewProfile={handleViewProfile}
      />

      <SidebarAdmin className="no-print" isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <main className="admin-layout__main">
        <div className="admin-layout__content">
          <Outlet />
        </div>
      </main>

      <Footer className="no-print" />
    </div>
  );
};

export default AdminLayout;