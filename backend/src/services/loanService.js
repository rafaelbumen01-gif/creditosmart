const { loanRepo, clientRepo } = require("../repositories");

class LoanService {
  getAll(filter = {}) {
    const loans = loanRepo.findAll(filter);
    return loans.map((loan) => {
      const client = clientRepo.findById(loan.clientId);
      return { ...loan, clientName: client?.name || "Desconocido" };
    });
  }

  getById(id) {
    const loan = loanRepo.findById(id);
    if (!loan) {
      const err = new Error("Préstamo no encontrado");
      err.statusCode = 404;
      throw err;
    }
    const client = clientRepo.findById(loan.clientId);
    return { ...loan, clientName: client?.name || "Desconocido" };
  }

  create(data) {
    const client = clientRepo.findById(data.clientId);
    if (!client) {
      const err = new Error("Cliente no encontrado");
      err.statusCode = 404;
      throw err;
    }

    const amount = parseFloat(data.amount);
    const rate = parseFloat(data.rate);
    const term = parseInt(data.term);

    // Interés simple mensual
    const totalInterest = amount * (rate / 100) * term;
    const monthlyPayment = Math.round((amount + totalInterest) / term);

    const loan = loanRepo.create({
      clientId: data.clientId,
      amount,
      rate,
      term,
      monthlyPayment,
      totalInterest: Math.round(totalInterest),
      startDate: data.startDate || new Date().toISOString().slice(0, 10),
      status: "active",
      paidInstallments: 0,
    });

    return { ...loan, clientName: client.name };
  }

  update(id, data) {
    const updated = loanRepo.update(id, data);
    if (!updated) {
      const err = new Error("Préstamo no encontrado");
      err.statusCode = 404;
      throw err;
    }
    return updated;
  }

  delete(id) {
    const deleted = loanRepo.delete(id);
    if (!deleted) {
      const err = new Error("Préstamo no encontrado");
      err.statusCode = 404;
      throw err;
    }
    return true;
  }

  simulate({ amount, rate, term }) {
    const a = parseFloat(amount);
    const r = parseFloat(rate);
    const t = parseInt(term);
    const totalInterest = a * (r / 100) * t;
    const monthlyPayment = Math.round((a + totalInterest) / t);
    const totalToPay = a + totalInterest;

    return {
      amount: a,
      rate: r,
      term: t,
      monthlyPayment,
      totalInterest: Math.round(totalInterest),
      totalToPay: Math.round(totalToPay),
    };
  }

  /**
   * Genera la tabla de amortización completa de un préstamo.
   * Cruza con los pagos reales para mostrar cuáles cuotas están pagadas,
   * pendientes o vencidas.
   */
  getAmortization(loanId) {
    const loan = loanRepo.findById(loanId);
    if (!loan) {
      const err = new Error("Préstamo no encontrado");
      err.statusCode = 404;
      throw err;
    }

    const client = clientRepo.findById(loan.clientId);
    const { paymentRepo } = require("../repositories");
    const realPayments = paymentRepo
      .findAll()
      .filter((p) => p.loanId === loanId)
      .sort((a, b) => a.installment - b.installment);

    const schedule = [];
    const startDate = new Date(loan.startDate + "T00:00:00");
    let balance = loan.amount + (loan.totalInterest || 0);
    const monthlyInterest = loan.amount * (loan.rate / 100);
    const monthlyPrincipal = loan.monthlyPayment - monthlyInterest;
    const today = new Date();

    for (let i = 1; i <= loan.term; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      const realPayment = realPayments.find((p) => p.installment === i);
      const principal = Math.min(monthlyPrincipal, balance);
      const interest = monthlyInterest;
      const payment = Math.round(principal + interest);
      balance = Math.max(0, Math.round(balance - payment));

      let status = "pending";
      if (realPayment) {
        status = "paid";
      } else if (dueDate < today) {
        status = "overdue";
      }

      schedule.push({
        installment: i,
        dueDate: dueDate.toISOString().slice(0, 10),
        principal: Math.round(principal),
        interest: Math.round(interest),
        payment,
        balance,
        status,
        paidDate: realPayment?.date || null,
        paidAmount: realPayment?.amount || null,
        method: realPayment?.method || null,
      });
    }

    return {
      loan: {
        id: loan.id,
        clientName: client?.name || "Desconocido",
        clientCedula: client?.cedula || "",
        amount: loan.amount,
        rate: loan.rate,
        term: loan.term,
        monthlyPayment: loan.monthlyPayment,
        totalInterest: loan.totalInterest,
        totalToPay: loan.amount + (loan.totalInterest || 0),
        startDate: loan.startDate,
        status: loan.status,
        paidInstallments: loan.paidInstallments,
      },
      schedule,
      summary: {
        totalPaid: realPayments.reduce((s, p) => s + p.amount, 0),
        totalPending: schedule
          .filter((s) => s.status !== "paid")
          .reduce((s, row) => s + row.payment, 0),
        overdueCount: schedule.filter((s) => s.status === "overdue").length,
        nextDueDate: schedule.find((s) => s.status === "pending")?.dueDate || null,
      },
    };
  }

  getDashboardStats() {
    const loans = loanRepo.findAll();
    const totalLoaned = loans.reduce((s, l) => s + l.amount, 0);
    const activeLoans = loans.filter((l) => l.status === "active").length;
    const overdueLoans = loans.filter((l) => l.status === "overdue").length;
    const completedLoans = loans.filter((l) => l.status === "completed").length;
    const totalInterest = loans.reduce((s, l) => s + (l.totalInterest || 0), 0);

    return {
      totalLoaned,
      activeLoans,
      overdueLoans,
      completedLoans,
      totalLoans: loans.length,
      totalInterest,
    };
  }
}

module.exports = new LoanService();
