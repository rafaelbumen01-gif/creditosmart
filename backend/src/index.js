const express = require("express");
const cors = require("cors");
const config = require("./config");
const auth = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clients");
const loanRoutes = require("./routes/loans");
const paymentRoutes = require("./routes/payments");
const notificationRoutes = require("./routes/notifications");

const app = express();

// ─── Global Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Health Check ───────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", version: "1.0.0", name: "CreditoSmart API" });
});

// ─── Public Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ─── Protected Routes ───────────────────────────────────────────────
app.use("/api/clients", auth, clientRoutes);
app.use("/api/loans", auth, loanRoutes);
app.use("/api/payments", auth, paymentRoutes);
app.use("/api/notifications", auth, notificationRoutes);

// ─── Error Handler ──────────────────────────────────────────────────
app.use(errorHandler);

// ─── Serve Frontend (Production) ────────────────────────────────────
const path = require("path");
const frontendDist = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendDist));
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

// ─── Start ──────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 CreditoSmart API corriendo en http://localhost:${config.port}`);
  console.log(`📋 Health check: http://localhost:${config.port}/api/health\n`);
});

module.exports = app;
