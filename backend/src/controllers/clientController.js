const clientService = require("../services/clientService");

exports.getAll = (req, res, next) => {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (search) filter.name = search;
    if (status) filter.status = status;
    res.json(clientService.getAll(filter));
  } catch (err) {
    next(err);
  }
};

exports.getById = (req, res, next) => {
  try {
    res.json(clientService.getById(req.params.id));
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    const client = clientService.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
};

exports.update = (req, res, next) => {
  try {
    res.json(clientService.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
};

exports.delete = (req, res, next) => {
  try {
    clientService.delete(req.params.id);
    res.json({ message: "Cliente eliminado" });
  } catch (err) {
    next(err);
  }
};
