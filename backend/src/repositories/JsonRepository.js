/**
 * JsonRepository
 * 
 * Patrón Repository sobre archivos JSON.
 * Cuando migres a PostgreSQL/MongoDB, solo reemplazas esta clase
 * con una implementación que hable con la DB — el resto del código
 * (services, controllers, routes) no cambia.
 */
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");

class JsonRepository {
  constructor(entityName) {
    this.filePath = path.join(config.dataDir, `${entityName}.json`);
    this._ensureFile();
  }

  _ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), "utf-8");
    }
  }

  _read() {
    const raw = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(raw);
  }

  _write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  findAll(filter = {}) {
    let items = this._read();
    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined && value !== null && value !== "") {
        items = items.filter((item) => {
          if (typeof item[key] === "string") {
            return item[key].toLowerCase().includes(String(value).toLowerCase());
          }
          return item[key] === value;
        });
      }
    }
    return items;
  }

  findById(id) {
    const items = this._read();
    return items.find((item) => item.id === id) || null;
  }

  findOne(predicate) {
    const items = this._read();
    return items.find(predicate) || null;
  }

  create(data) {
    const items = this._read();
    const newItem = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    this._write(items);
    return newItem;
  }

  update(id, data) {
    const items = this._read();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...data,
      id: items[index].id,
      createdAt: items[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    this._write(items);
    return items[index];
  }

  delete(id) {
    const items = this._read();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    this._write(items);
    return true;
  }

  count(filter = {}) {
    return this.findAll(filter).length;
  }
}

module.exports = JsonRepository;
