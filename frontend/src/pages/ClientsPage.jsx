import { useState, useEffect } from "react";
import { clientsApi } from "../api/services";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", cedula: "", phone: "", email: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await clientsApi.getAll(search ? `search=${search}` : "");
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search]);

  const handleAdd = async () => {
    if (!form.name || !form.cedula) return;
    setError("");
    try {
      await clientsApi.create(form);
      setForm({ name: "", cedula: "", phone: "", email: "", address: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    try {
      await clientsApi.delete(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, padding: "8px 16px", flex: 1, minWidth: 200 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input style={{ border: "none", outline: "none", fontSize: 14, background: "transparent", flex: 1 }} placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Nuevo Cliente</button>
      </div>

      {error && <p style={{ color: "#E63946", fontSize: 13, marginBottom: 12 }}>{error}</p>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700 }}>Registrar Cliente</h3>
            <div className="form-grid">
              <div><label className="label">Nombre *</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className="label">Cédula *</label><input className="input" value={form.cedula} onChange={(e) => setForm({ ...form, cedula: e.target.value })} /></div>
              <div><label className="label">Teléfono</label><input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><label className="label">Email</label><input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div style={{ gridColumn: "1/-1" }}><label className="label">Dirección</label><input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAdd}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ overflowX: "auto" }}>
        {loading ? (
          <p style={{ padding: 32, textAlign: "center", color: "#6B7280" }}>Cargando...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th className="hide-mobile">Teléfono</th>
                <th className="hide-mobile">Email</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.cedula}</td>
                  <td className="hide-mobile">{c.phone}</td>
                  <td className="hide-mobile">{c.email}</td>
                  <td><span className={`badge badge-${c.status === "active" ? "success" : "muted"}`}>{c.status === "active" ? "Activo" : "Inactivo"}</span></td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => handleDelete(c.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "#6B7280" }}>No se encontraron clientes</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
