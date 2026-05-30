/**
 * Seed script - popula los JSON con datos de demo.
 * Ejecutar: npm run seed
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const bcrypt = require("bcryptjs");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const dataDir = path.join(__dirname, "../src/data");

function writeJson(name, data) {
  fs.writeFileSync(path.join(dataDir, `${name}.json`), JSON.stringify(data, null, 2));
  console.log(`  ✅ ${name}.json (${data.length} registros)`);
}

async function seed() {
  console.log("\n🌱 Iniciando seed de CreditoSmart...\n");

  // Ensure data dir exists
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const now = new Date().toISOString();
  const date = (d) => d;

  // ─── Users ──────────────────────────────────────────────────────
  const adminId = uuidv4();
  const hashedPw = await bcrypt.hash("admin123", 10);
  const users = [
    { id: adminId, name: "Administrador", email: "admin@creditosmart.com", password: hashedPw, role: "admin", createdAt: now, updatedAt: now },
  ];
  writeJson("users", users);

  // ─── Clients ────────────────────────────────────────────────────
  const clientIds = Array.from({ length: 5 }, () => uuidv4());
  const clients = [
    { id: clientIds[0], name: "María García López", cedula: "1023456789", phone: "300-123-4567", email: "maria.garcia@mail.com", address: "Cra 5 #12-34, Carmen de Bolívar", status: "active", createdAt: date("2025-01-15T10:00:00Z"), updatedAt: now },
    { id: clientIds[1], name: "José Martínez Ruiz", cedula: "1034567890", phone: "310-234-5678", email: "jose.martinez@mail.com", address: "Calle 8 #5-67, Cartagena", status: "active", createdAt: date("2025-02-20T10:00:00Z"), updatedAt: now },
    { id: clientIds[2], name: "Ana Rodríguez Pérez", cedula: "1045678901", phone: "315-345-6789", email: "ana.rodriguez@mail.com", address: "Av. Principal #23-45, Sincelejo", status: "active", createdAt: date("2025-03-10T10:00:00Z"), updatedAt: now },
    { id: clientIds[3], name: "Carlos Herrera Díaz", cedula: "1056789012", phone: "320-456-7890", email: "carlos.herrera@mail.com", address: "Cra 10 #8-90, Barranquilla", status: "inactive", createdAt: date("2024-11-05T10:00:00Z"), updatedAt: now },
    { id: clientIds[4], name: "Laura Jiménez Mora", cedula: "1067890123", phone: "301-567-8901", email: "laura.jimenez@mail.com", address: "Calle 15 #3-21, Carmen de Bolívar", status: "active", createdAt: date("2025-04-01T10:00:00Z"), updatedAt: now },
  ];
  writeJson("clients", clients);

  // ─── Loans ──────────────────────────────────────────────────────
  const loanIds = Array.from({ length: 5 }, () => uuidv4());
  const loans = [
    { id: loanIds[0], clientId: clientIds[0], amount: 5000000, rate: 1.5, term: 12, monthlyPayment: 458333, totalInterest: 500000, startDate: "2025-02-01", status: "active", paidInstallments: 4, createdAt: now, updatedAt: now },
    { id: loanIds[1], clientId: clientIds[1], amount: 10000000, rate: 2.0, term: 24, monthlyPayment: 541667, totalInterest: 3000000, startDate: "2025-03-15", status: "active", paidInstallments: 2, createdAt: now, updatedAt: now },
    { id: loanIds[2], clientId: clientIds[2], amount: 3000000, rate: 1.8, term: 6, monthlyPayment: 527000, totalInterest: 162000, startDate: "2025-01-10", status: "overdue", paidInstallments: 3, createdAt: now, updatedAt: now },
    { id: loanIds[3], clientId: clientIds[4], amount: 8000000, rate: 1.2, term: 18, monthlyPayment: 497778, totalInterest: 960000, startDate: "2025-04-20", status: "active", paidInstallments: 1, createdAt: now, updatedAt: now },
    { id: loanIds[4], clientId: clientIds[3], amount: 2000000, rate: 2.5, term: 6, monthlyPayment: 358333, totalInterest: 150000, startDate: "2024-12-01", status: "completed", paidInstallments: 6, createdAt: now, updatedAt: now },
  ];
  writeJson("loans", loans);

  // ─── Payments ───────────────────────────────────────────────────
  const payments = [
    { id: uuidv4(), loanId: loanIds[0], clientId: clientIds[0], amount: 458333, date: "2025-05-01", installment: 4, status: "paid", method: "Transferencia", createdAt: now, updatedAt: now },
    { id: uuidv4(), loanId: loanIds[1], clientId: clientIds[1], amount: 541667, date: "2025-05-15", installment: 2, status: "paid", method: "Efectivo", createdAt: now, updatedAt: now },
    { id: uuidv4(), loanId: loanIds[2], clientId: clientIds[2], amount: 527000, date: "2025-04-10", installment: 3, status: "paid", method: "Nequi", createdAt: now, updatedAt: now },
    { id: uuidv4(), loanId: loanIds[3], clientId: clientIds[4], amount: 497778, date: "2025-05-20", installment: 1, status: "paid", method: "Nequi", createdAt: now, updatedAt: now },
    { id: uuidv4(), loanId: loanIds[0], clientId: clientIds[0], amount: 458333, date: "2025-04-01", installment: 3, status: "paid", method: "Daviplata", createdAt: now, updatedAt: now },
    { id: uuidv4(), loanId: loanIds[1], clientId: clientIds[1], amount: 541667, date: "2025-04-15", installment: 1, status: "paid", method: "Transferencia", createdAt: now, updatedAt: now },
    { id: uuidv4(), loanId: loanIds[4], clientId: clientIds[3], amount: 358333, date: "2025-05-01", installment: 6, status: "paid", method: "Efectivo", createdAt: now, updatedAt: now },
  ];
  writeJson("payments", payments);

  // ─── Notifications ─────────────────────────────────────────────
  const notifications = [
    { id: uuidv4(), type: "urgent", title: "Pago vencido", message: "Ana Rodríguez tiene 1 cuota vencida por $527.000", read: false, createdAt: date("2025-05-12T10:00:00Z"), updatedAt: now },
    { id: uuidv4(), type: "warning", title: "Pago próximo", message: "María García debe pagar $458.333 el 01/06/2025", read: false, createdAt: date("2025-05-25T10:00:00Z"), updatedAt: now },
    { id: uuidv4(), type: "info", title: "Préstamo completado", message: "Carlos Herrera completó todas sus cuotas", read: true, createdAt: date("2025-05-01T10:00:00Z"), updatedAt: now },
    { id: uuidv4(), type: "warning", title: "Pago próximo", message: "Laura Jiménez debe pagar $497.778 el 20/06/2025", read: false, createdAt: date("2025-05-28T10:00:00Z"), updatedAt: now },
    { id: uuidv4(), type: "info", title: "Nuevo cliente registrado", message: "Laura Jiménez Mora se registró en el sistema", read: true, createdAt: date("2025-04-01T10:00:00Z"), updatedAt: now },
  ];
  writeJson("notifications", notifications);

  console.log("\n✨ Seed completado!");
  console.log("\n📧 Usuario demo:");
  console.log("   Email:    admin@creditosmart.com");
  console.log("   Password: admin123\n");
}

seed().catch(console.error);
