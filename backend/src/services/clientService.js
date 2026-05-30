const { clientRepo } = require("../repositories");

class ClientService {
  getAll(filter = {}) {
    return clientRepo.findAll(filter);
  }

  getById(id) {
    const client = clientRepo.findById(id);
    if (!client) {
      const err = new Error("Cliente no encontrado");
      err.statusCode = 404;
      throw err;
    }
    return client;
  }

  create(data) {
    const existing = clientRepo.findOne((c) => c.cedula === data.cedula);
    if (existing) {
      const err = new Error("Ya existe un cliente con esa cédula");
      err.statusCode = 409;
      throw err;
    }
    return clientRepo.create({ ...data, status: "active" });
  }

  update(id, data) {
    const updated = clientRepo.update(id, data);
    if (!updated) {
      const err = new Error("Cliente no encontrado");
      err.statusCode = 404;
      throw err;
    }
    return updated;
  }

  delete(id) {
    const deleted = clientRepo.delete(id);
    if (!deleted) {
      const err = new Error("Cliente no encontrado");
      err.statusCode = 404;
      throw err;
    }
    return true;
  }
}

module.exports = new ClientService();
