const paymentService = require("../services/paymentService");

exports.getAll = (req, res, next) => {
  try {
    res.json(paymentService.getAll(req.query));
  } catch (err) {
    next(err);
  }
};

exports.getByLoan = (req, res, next) => {
  try {
    res.json(paymentService.getByLoanId(req.params.loanId));
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const payment = paymentService.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
};

exports.stats = (req, res, next) => {
  try {
    res.json(paymentService.getStats());
  } catch (err) {
    next(err);
  }
};
