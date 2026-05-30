import { useState, useEffect } from "react";
import { loansApi, paymentsApi, clientsApi } from "../api/services";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

function formatCOP(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

const COLORS = ["#1B9AAA", "#2DC653", "#E63946", "#E8AA14", "#7C3AED"];

export default function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [payStats, setPayStats] = useState(null);
  const [loans, setLoans] = useState([]);
  const [clients, setClients] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    Promise.all([
      loansApi.dashboard(),
      paymentsApi.stats(),
      loansApi.getAll(),
      clientsApi.getAll(),
      paymentsApi.getAll(),
    ]).then(([s, ps, l, c, p]) => {
      setStats(s);
      setPayStats(ps);
      setLoans(l);
      setClients(c);
      setPayments(p);
    }).catch(console.error);
  }, []);

  if (!stats) return <p style={{ padding: 40, color: "#6B7280" }}>Cargando reportes...</p>;

  const statusData = [
    { name: "Activos", value: stats.activeLoans, color: "#1B9AAA" },
    { name: "Vencidos", value: stats.overdueLoans, color: "#E63946" },
    { name: "Completados", value: stats.completedLoans, color: "#2DC653" },
  ].filter((d) => d.value > 0);

  // Group payments by method
  const byMethod = {};
  payments.forEach((p) => {
    byMethod[p.method] = (byMethod[p.method] || 0) + p.amount;
  });
  const methodData = Object.entries(byMethod).map(([name, value]) => ({ name, value }));

  // Top clients by loan amount
  const clientLoanTotals = {};
  loans.forEach((l) => {
    const key = l.clientName || l.clientId;
    clientLoanTotals[key] = (clientLoanTotals[key] || 0) + l.amount;
  });
  const topClients = Object.entries(clientLoanTotals)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const isMobile = window.innerWidth < 768;

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 4}, 1fr)`, gap: 16, marginBottom: 24 }}>
        <SummaryCard label="Total Prestado" value={formatCOP(stats.totalLoaned)} />
        <SummaryCard label="Total Recaudado" value={formatCOP(payStats?.totalCollected || 0)} />
        <SummaryCard label="Intereses Generados" value={formatCOP(stats.totalInterest)} />
        <SummaryCard label="Total Clientes" value={clients.length} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Distribución por Estado</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Top Clientes por Monto</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topClients} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis type="number" tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatCOP(v)} />
              <Bar dataKey="total" fill="#1B9AAA" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Recaudo por Método de Pago</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={methodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {methodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => formatCOP(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Resumen General</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Row label="Préstamos totales" value={stats.totalLoans} />
            <Row label="Préstamos activos" value={stats.activeLoans} />
            <Row label="Préstamos vencidos" value={stats.overdueLoans} accent="#E63946" />
            <Row label="Préstamos completados" value={stats.completedLoans} />
            <Row label="Pagos registrados" value={payStats?.totalPayments || 0} />
            <Row label="Clientes activos" value={clients.filter((c) => c.status === "active").length} />
            <Row label="Clientes inactivos" value={clients.filter((c) => c.status === "inactive").length} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #E5E7EB" }}>
      <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F3F4F6" }}>
      <span style={{ color: "#6B7280", fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: 14, color: accent || "#1A1A2E" }}>{value}</span>
    </div>
  );
}
