import { useState, useEffect } from "react";
import { notificationsApi } from "../api/services";

const typeStyles = {
  urgent: { bg: "#FDE8EA", color: "#E63946", icon: "⚠" },
  warning: { bg: "#FEF3CD", color: "#E8AA14", icon: "⏰" },
  info: { bg: "#D0F0F7", color: "#1B9AAA", icon: "ℹ" },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setNotifs(await notificationsApi.getAll());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await notificationsApi.markAsRead(id);
    load();
  };

  const markAllRead = async () => {
    await notificationsApi.markAllAsRead();
    load();
  };

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 14, color: "#6B7280" }}>{unread} sin leer</span>
        {unread > 0 && (
          <button className="btn btn-ghost" onClick={markAllRead}>Marcar todas como leídas</button>
        )}
      </div>

      {error && <p style={{ color: "#E63946", fontSize: 13, marginBottom: 12 }}>{error}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifs.map((n) => {
          const style = typeStyles[n.type] || typeStyles.info;
          return (
            <div
              key={n.id}
              className="card"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                opacity: n.read ? 0.6 : 1,
                cursor: n.read ? "default" : "pointer",
                borderLeft: `4px solid ${style.color}`,
              }}
              onClick={() => !n.read && markRead(n.id)}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: style.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                {style.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{n.title}</div>
                <div style={{ fontSize: 14, color: "#6B7280" }}>{n.message}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>
                  {new Date(n.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                  {!n.read && <span style={{ marginLeft: 8, color: style.color, fontWeight: 600 }}>• Nueva</span>}
                </div>
              </div>
            </div>
          );
        })}
        {notifs.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: 40, color: "#6B7280" }}>No hay notificaciones</div>
        )}
      </div>
    </div>
  );
}
