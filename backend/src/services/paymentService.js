const { paymentRepo, loanRepo } = require("../repositories");

class PaymentService {
  getAll(filter = {}) {
    return paymentRepo.findAll(filter);
  }

  getByLoanId(loanId) {
    return paymentRepo.findAll().filter((p) => p.loanId === loanId);
  }

  create(data) {
    const loan = loanRepo.findById(data.loanId);
    if (!loan) {
      const err = new Error("Préstamo no encontrado");
      err.statusCode = 404;
      throw err;
    }

    if (loan.status === "completed") {
      const err = new Error("Este préstamo ya fue completado");
      err.statusCode = 400;
      throw err;
    }

    const payment = paymentRepo.create({
      loanId: data.loanId,
      clientId: loan.clientId,
      amount: parseFloat(data.amount),
      method: data.method || "Transferencia",
      installment: loan.paidInstallments + 1,
      status: "paid",
      date: data.date || new Date().toISOString().slice(0, 10),
    });

    // Actualizar préstamo
    const newPaid = loan.paidInstallments + 1;
    const newStatus = newPaid >= loan.term ? "completed" : loan.status;
    loanRepo.update(loan.id, {
      paidInstallments: newPaid,
      status: newStatus,
    });

    return payment;
  }

  getStats() {
    const payments = paymentRepo.findAll();
    const totalCollected = payments
      .filter((p) => p.status === "paid")
      .reduce((s, p) => s + p.amount, 0);
    const totalPayments = payments.length;

    return { totalCollected, totalPayments };
  }
}

module.exports = new PaymentService();
