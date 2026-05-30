import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logo}>CreditoSmart</h1>
          <p style={styles.subtitle}>Crear cuenta</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Nombre completo</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label className="label">Contraseña</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p style={styles.footer}>
          ¿Ya tienes cuenta? <Link to="/login" style={styles.link}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0D1B2A 0%, #1B3A4B 100%)", padding: 16 },
  card: { background: "#fff", borderRadius: 16, padding: 40, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  header: { textAlign: "center", marginBottom: 32 },
  logo: { fontSize: 28, fontWeight: 800, color: "#1B9AAA", letterSpacing: "-0.5px" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  error: { color: "#E63946", fontSize: 13, marginBottom: 12, textAlign: "center" },
  footer: { textAlign: "center", marginTop: 20, fontSize: 14, color: "#6B7280" },
  link: { color: "#1B9AAA", fontWeight: 600 },
};
