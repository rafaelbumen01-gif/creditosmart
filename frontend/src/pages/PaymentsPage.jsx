import { useState, useEffect } from "react";
import { paymentsApi, loansApi } from "../api/services";

function formatCOP(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ loanId: "", amount: "", method: "Transferencia" });
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [p, l, s] = await Promise.all([paymentsApi.getAll(), loansApi.getAll(), paymentsApi.stats()]);
      setPayments(p.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoans(l.filter((lo) => lo.status !== "completed"));
      setStats(s);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const selectedLoan = loans.find((l) => l.id === form.loanId);

  useEffect(() => {
    if (selectedLoan) {
      setForm((f) => ({ ...f, amount: String(selectedLoan.monthlyPayment) }));
    }
  }, [form.loanId]);

  const handleAdd = async () => {
    if (!form.loanId || !form.amount) return;
    setError("");
    try {
      await paymentsApi.create(form);
      setForm({ loanId: "", amount: "", method: "Transferencia" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 16 }}>
          {stats && (
            <>
              <div style={{ background: "#D0F0F7", borderRadius: 10, padding: "10px 18px" }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Total Recaudado</span>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{formatCOP(stats.totalCollected)}</div>
              </div>
              <div style={{ background: "#E8F9EE", borderRadius: 10, padding: "10px 18px" }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>Pagos Registrados</span>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{stats.totalPayments}</div>
              </div>
            </>
          )}
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Registrar Pago</button>
      </div>

      {error && <p style={{ color: "#E63946", fontSize: 13, marginBottom: 12 }}>{error}</p>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>Registrar Pago</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="label">Préstamo *</label>
                <select className="input" value={form.loanId} onChange={(e) => setForm({ ...form, loanId: e.target.value })}>
                  <option value="">Seleccionar préstamo...</option>
                  {loans.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.clientName} — {formatCOP(l.amount)} ({l.paidInstallments}/{l.term} cuotas)
                    </option>
                  ))}
                </select>
              </div>
              {selectedLoan && (
                <div style={{ padding: 12, background: "#F8F9FB", borderRadius: 10, fontSize: 13, color: "#6B7280" }}>
                  Cuota sugerida: <strong>{formatCOP(selectedLoan.monthlyPayment)}</strong> · Cuota #{selectedLoan.paidInstallments + 1} de {selectedLoan.term}
                </div>
              )}
              <div className="form-grid">
                <div>
                  <label className="label">Monto (COP) *</label>
                  <input className="input" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div>
                  <label className="label">Método de pago</label>
                  <select className="input" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                    <option>Transferencia</option>
                    <option>Efectivo</option>
                    <option>Nequi</option>
                    <option>Daviplata</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAdd}>Registrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Cuota #</th>
              <th className="hide-mobile">Método</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{new Date(p.date || p.createdAt).toLocaleDateString("es-CO")}</td>
                <td><strong>{formatCOP(p.amount)}</strong></td>
                <td>#{p.installment}</td>
                <td className="hide-mobile">{p.method}</td>
                <td><span className="badge badge-success">Pagado</span></td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 32, color: "#6B7280" }}>No hay pagos registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
