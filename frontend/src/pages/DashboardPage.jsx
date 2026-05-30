import { useState, useEffect } from "react";
import { loansApi, paymentsApi } from "../api/services";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const COLORS = { accent: "#1B9AAA", success: "#2DC653", danger: "#E63946", warning: "#E8AA14", border: "#E5E7EB", textMuted: "#6B7280" };

function formatCOP(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #E5E7EB", borderLeft: `4px solid ${accent}` }}>
      <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", marginTop: 4 }}>{value}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [payStats, setPayStats] = useState(null);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    loansApi.dashboard().then(setStats).catch(console.error);
    paymentsApi.stats().then(setPayStats).catch(console.error);
    loansApi.getAll().then(setLoans).catch(console.error);
  }, []);

  if (!stats) return <p style={{ padding: 40, color: COLORS.textMuted }}>Cargando dashboard...</p>;

  const pieData = [
    { name: "Activos", value: stats.activeLoans, color: COLORS.accent },
    { name: "Vencidos", value: stats.overdueLoans, color: COLORS.danger },
    { name: "Completados", value: stats.completedLoans, color: COLORS.success },
  ].filter((d) => d.value > 0);

  const isMobile = window.innerWidth < 768;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: 20 }}>
        <StatCard label="Total Prestado" value={formatCOP(stats.totalLoaned)} accent={COLORS.accent} />
        <StatCard label="Préstamos Activos" value={stats.activeLoans} accent={COLORS.success} />
        <StatCard label="En Mora" value={stats.overdueLoans} accent={COLORS.danger} />
        <StatCard label="Recaudado" value={formatCOP(payStats?.totalCollected || 0)} accent={COLORS.warning} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, marginTop: 24 }}>
        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Estado de Préstamos</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v) => v + " préstamos"} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Préstamos Recientes</h3>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {loans.slice(0, 5).map((l) => (
                  <tr key={l.id}>
                    <td><strong>{l.clientName}</strong></td>
                    <td>{formatCOP(l.amount)}</td>
                    <td>
                      <span className={`badge badge-${l.status === "active" ? "success" : l.status === "overdue" ? "danger" : l.status === "completed" ? "info" : "muted"}`}>
                        {l.status === "active" ? "Activo" : l.status === "overdue" ? "Vencido" : l.status === "completed" ? "Completado" : l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
