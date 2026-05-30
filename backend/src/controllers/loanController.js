const loanService = require("../services/loanService");

exports.getAll = (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    res.json(loanService.getAll(filter));
  } catch (err) {
    next(err);
  }
};

exports.getById = (req, res, next) => {
  try {
    res.json(loanService.getById(req.params.id));
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const loan = loanService.create(req.body);
    res.status(201).json(loan);
  } catch (err) {
    next(err);
  }
};

exports.update = (req, res, next) => {
  try {
    res.json(loanService.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

exports.delete = (req, res, next) => {
  try {
    loanService.delete(req.params.id);
    res.json({ message: "Préstamo eliminado" });
  } catch (err) {
    next(err);
  }
};

exports.simulate = (req, res, next) => {
  try {
    res.json(loanService.simulate(req.body));
  } catch (err) {
    next(err);
  }
};

exports.dashboard = (req, res, next) => {
  try {
    res.json(loanService.getDashboardStats());
  } catch (err) {
    next(err);
  }
};

exports.amortization = (req, res, next) => {
  try {
    res.json(loanService.getAmortization(req.params.id));
  } catch (err) {
    next(err);
  }
};
