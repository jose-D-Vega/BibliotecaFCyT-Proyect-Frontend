import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/UserLayout.css";
import Navbar from "./layouts_components/Navbar";
import SidebarUser from "./layouts_components/SidebarUser";
import Footer from "./layouts_components/Footer";

const UserLayout = () => {
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

  const handleViewProfile = () => {
    navigate("/app/perfil");
  };

  const handleSwitchRole = () => {
    switchRol();
    navigate("/select-rol", { replace: true });
  };

  return (
    <div className="user-layout">
      <Navbar
        onToggleSidebar={handleToggleSidebar}
        role="user"
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onViewProfile={handleViewProfile}
      />

      <SidebarUser isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <main className="user-layout__main">
        <div className="user-layout__content">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;