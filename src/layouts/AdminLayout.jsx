import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/AdminLayout.css";
import Navbar from "./Navbar";
import SidebarAdmin from "./SidebarAdmin";
import Footer from "./Footer";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, switchRol } = useAuth();
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
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
        onToggleSidebar={handleToggleSidebar}
        role="admin"
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onViewProfile={handleViewProfile}
      />

      <SidebarAdmin isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <main className="admin-layout__main">
        <div className="admin-layout__content">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLayout;