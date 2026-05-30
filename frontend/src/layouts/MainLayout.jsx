import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/clients", label: "Clientes", icon: "👥" },
  { to: "/loans", label: "Préstamos", icon: "💰" },
  { to: "/payments", label: "Pagos", icon: "💳" },
  { to: "/notifications", label: "Notificaciones", icon: "🔔" },
  { to: "/reports", label: "Reportes", icon: "📈" },
];

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 998 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: isMobile ? 260 : collapsed ? 70 : 240,
          background: "#0D1B2A",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          transition: "width 0.2s, transform 0.2s",
          position: isMobile ? "fixed" : "sticky",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 999,
          transform: isMobile && !mobileOpen ? "translateX(-100%)" : "translateX(0)",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <div style={{ padding: collapsed ? "20px 10px" : "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <h1 style={{ fontSize: collapsed ? 16 : 22, fontWeight: 800, color: "#1B9AAA", whiteSpace: "nowrap" }}>
            {collapsed ? "CS" : "CreditoSmart"}
          </h1>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "10px 14px" : "10px 16px",
                borderRadius: 10,
                color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                background: isActive ? "rgba(27,154,170,0.2)" : "transparent",
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                whiteSpace: "nowrap",
                textDecoration: "none",
                transition: "all 0.15s",
              })}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {(!collapsed || isMobile) && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User + collapse */}
        <div style={{ padding: collapsed ? "16px 8px" : "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          {(!collapsed || isMobile) && (
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name || user?.email}
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 13, fontWeight: 500 }}
          >
            {collapsed && !isMobile ? "↩" : "Cerrar sesión"}
          </button>
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{ width: "100%", padding: "6px", marginTop: 6, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}
            >
              {collapsed ? "→" : "←"}
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header style={{ height: 60, background: "#fff", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
          {isMobile && (
            <button onClick={() => setMobileOpen(true)} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", padding: 0 }}>
              ☰
            </button>
          )}
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
            {NAV_ITEMS.find((n) => {
              const path = window.location.pathname;
              return n.to === "/" ? path === "/" : path.startsWith(n.to);
            })?.label || "CreditoSmart"}
          </h2>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
