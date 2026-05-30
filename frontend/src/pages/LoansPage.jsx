import { useState, useEffect } from "react";
import { loansApi, clientsApi } from "../api/services";

function formatCOP(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_MAP = {
  paid: { label: "Pagado", cls: "badge-success" },
  pending: { label: "Pendiente", cls: "badge-warning" },
  overdue: { label: "Vencido", cls: "badge-danger" },
};

/* ─── Amortization Modal ─────────────────────────────────────── */
function AmortizationModal({ loanId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loansApi.amortization(loanId)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loanId]);

  if (loading) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900 }}>
        <p style={{ textAlign: "center", padding: 40, color: "#6B7280" }}>Generando tabla de amortización...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p style={{ color: "#E63946" }}>{error}</p>
        <button className="btn btn-ghost" onClick={onClose} style={{ marginTop: 16 }}>Cerrar</button>
      </div>
    </div>
  );

  const { loan, schedule, summary } = data;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 960, padding: 28 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Tabla de Amortización</h2>
            <p style={{ margin: "4px 0 0", color: "#6B7280", fontSize: 14 }}>
              {loan.clientName} · Cédula: {loan.clientCedula}
            </p>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", color: "#6B7280", padding: 0 }}>✕</button>
        </div>

        {/* Loan summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
          <MiniCard label="Monto" value={formatCOP(loan.amount)} accent="#1B9AAA" />
          <MiniCard label="Tasa mensual" value={`${loan.rate}%`} accent="#7C3AED" />
          <MiniCard label="Plazo" value={`${loan.term} meses`} accent="#E8AA14" />
          <MiniCard label="Cuota mensual" value={formatCOP(loan.monthlyPayment)} accent="#2DC653" />
          <MiniCard label="Total intereses" value={formatCOP(loan.totalInterest)} accent="#E63946" />
          <MiniCard label="Total a pagar" value={formatCOP(loan.totalToPay)} accent="#0D1B2A" />
        </div>

        {/* Progress summary */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ padding: "10px 16px", background: "#E8F9EE", borderRadius: 10, fontSize: 13 }}>
            <strong style={{ color: "#2DC653" }}>Pagado:</strong> {formatCOP(summary.totalPaid)}
          </div>
          <div style={{ padding: "10px 16px", background: "#FEF3CD", borderRadius: 10, fontSize: 13 }}>
            <strong style={{ color: "#E8AA14" }}>Pendiente:</strong> {formatCOP(summary.totalPending)}
          </div>
          {summary.overdueCount > 0 && (
            <div style={{ padding: "10px 16px", background: "#FDE8EA", borderRadius: 10, fontSize: 13 }}>
              <strong style={{ color: "#E63946" }}>Cuotas vencidas:</strong> {summary.overdueCount}
            </div>
          )}
          {summary.nextDueDate && (
            <div style={{ padding: "10px 16px", background: "#D0F0F7", borderRadius: 10, fontSize: 13 }}>
              <strong style={{ color: "#1B9AAA" }}>Próximo pago:</strong> {formatDate(summary.nextDueDate)}
            </div>
          )}
        </div>

        {/* Amortization table */}
        <div style={{ overflowX: "auto", maxHeight: 400, overflowY: "auto", borderRadius: 10, border: "1px solid #E5E7EB" }}>
          <table style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ position: "sticky", top: 0, background: "#F8F9FB", zIndex: 1 }}>
                <th style={{ padding: "10px 12px", fontSize: 11 }}>#</th>
                <th style={{ padding: "10px 12px", fontSize: 11 }}>Fecha de Pago</th>
                <th style={{ padding: "10px 12px", fontSize: 11 }}>Capital</th>
                <th style={{ padding: "10px 12px", fontSize: 11 }}>Interés</th>
                <th style={{ padding: "10px 12px", fontSize: 11 }}>Cuota</th>
                <th style={{ padding: "10px 12px", fontSize: 11 }}>Saldo</th>
                <th style={{ padding: "10px 12px", fontSize: 11 }}>Estado</th>
                <th style={{ padding: "10px 12px", fontSize: 11 }}>Fecha Pagado</th>
                <th style={{ padding: "10px 12px", fontSize: 11 }}>Método</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => {
                const st = STATUS_MAP[row.status] || STATUS_MAP.pending;
                return (
                  <tr key={row.installment} style={{ background: row.status === "overdue" ? "#FFF5F5" : row.status === "paid" ? "#F7FDF9" : "transparent" }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700, fontSize: 13 }}>{row.installment}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13 }}>{formatDate(row.dueDate)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13 }}>{formatCOP(row.principal)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13 }}>{formatCOP(row.interest)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600 }}>{formatCOP(row.payment)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13 }}>{formatCOP(row.balance)}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <span className={`badge ${st.cls}`}>{st.label}</span>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 13, color: row.paidDate ? "#2DC653" : "#9CA3AF" }}>
                      {row.paidDate ? formatDate(row.paidDate) : "—"}
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: 13, color: "#6B7280" }}>{row.method || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: "#F8F9FB", fontWeight: 700 }}>
                <td colSpan={2} style={{ padding: "10px 12px", fontSize: 13 }}>TOTALES</td>
                <td style={{ padding: "10px 12px", fontSize: 13 }}>{formatCOP(schedule.reduce((s, r) => s + r.principal, 0))}</td>
                <td style={{ padding: "10px 12px", fontSize: 13 }}>{formatCOP(schedule.reduce((s, r) => s + r.interest, 0))}</td>
                <td style={{ padding: "10px 12px", fontSize: 13 }}>{formatCOP(schedule.reduce((s, r) => s + r.payment, 0))}</td>
                <td colSpan={4} style={{ padding: "10px 12px" }}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ label, value, accent }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: "12px 14px", border: "1px solid #E5E7EB", borderLeft: `3px solid ${accent}` }}>
      <div style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.3px" }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, marginTop: 2 }}>{value}</div>
    </div>
  );
}

/* ─── Main Loans Page ─────────────────────────────────────────── */
export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [amortLoanId, setAmortLoanId] = useState(null);
  const [form, setForm] = useState({ clientId: "", amount: "", rate: "", term: "" });
  const [simulation, setSimulation] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [l, c] = await Promise.all([loansApi.getAll(), clientsApi.getAll()]);
      setLoans(l);
      setClients(c.filter((cl) => cl.status === "active"));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSimulate = async () => {
    if (!form.amount || !form.rate || !form.term) return;
    try {
      const sim = await loansApi.simulate({ amount: form.amount, rate: form.rate, term: form.term });
      setSimulation(sim);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (form.amount && form.rate && form.term) handleSimulate();
    else setSimulation(null);
  }, [form.amount, form.rate, form.term]);

  const handleAdd = async () => {
    if (!form.clientId || !form.amount || !form.rate || !form.term) return;
    try {
      await loansApi.create(form);
      setForm({ clientId: "", amount: "", rate: "", term: "" });
      setShowForm(false);
      setSimulation(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Nuevo Préstamo</button>
      </div>

      {error && <p style={{ color: "#E63946", fontSize: 13, marginBottom: 12 }}>{error}</p>}

      {/* New loan modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>Registrar Préstamo</h3>
            <div className="form-grid">
              <div style={{ gridColumn: "1/-1" }}>
                <label className="label">Cliente *</label>
                <select className="input" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                  <option value="">Seleccionar...</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.cedula}</option>)}
                </select>
              </div>
              <div><label className="label">Monto (COP) *</label><input className="input" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
              <div><label className="label">Tasa mensual (%) *</label><input className="input" type="number" step="0.1" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} /></div>
              <div><label className="label">Plazo (meses) *</label><input className="input" type="number" value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} /></div>
            </div>
            {simulation && (
              <div style={{ marginTop: 16, padding: 14, background: "#D0F0F7", borderRadius: 10, fontSize: 14 }}>
                <strong>Simulación:</strong> Cuota mensual {formatCOP(simulation.monthlyPayment)}
                {" · "}Total intereses: {formatCOP(simulation.totalInterest)}
                {" · "}Total a pagar: {formatCOP(simulation.totalToPay)}
              </div>
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => { setShowForm(false); setSimulation(null); }}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAdd}>Crear Préstamo</button>
            </div>
          </div>
        </div>
      )}

      {/* Amortization modal */}
      {amortLoanId && (
        <AmortizationModal loanId={amortLoanId} onClose={() => setAmortLoanId(null)} />
      )}

      {/* Loans table */}
      <div className="card" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto</th>
              <th className="hide-mobile">Tasa</th>
              <th>Plazo</th>
              <th>Cuota</th>
              <th>Progreso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((l) => (
              <tr key={l.id}>
                <td><strong>{l.clientName}</strong></td>
                <td>{formatCOP(l.amount)}</td>
                <td className="hide-mobile">{l.rate}%</td>
                <td>{l.term} meses</td>
                <td>{formatCOP(l.monthlyPayment)}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: "#E5E7EB", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(l.paidInstallments / l.term) * 100}%`, height: "100%", background: "#1B9AAA", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>{l.paidInstallments}/{l.term}</span>
                  </div>
                </td>
                <td><span className={`badge badge-${l.status === "active" ? "success" : l.status === "overdue" ? "danger" : l.status === "completed" ? "info" : "muted"}`}>
                  {l.status === "active" ? "Activo" : l.status === "overdue" ? "Vencido" : l.status === "completed" ? "Completado" : l.status}
                </span></td>
                <td>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: "6px 12px", fontSize: 12 }}
                    onClick={() => setAmortLoanId(l.id)}
                  >
                    📋 Amortización
                  </button>
                </td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: 32, color: "#6B7280" }}>No hay préstamos registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
