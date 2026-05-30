const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { userRepo } = require("../repositories");

class AuthService {
  async register({ name, email, password, role = "admin" }) {
    const existing = userRepo.findOne((u) => u.email === email);
    if (existing) {
      const err = new Error("El email ya está registrado");
      err.statusCode = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepo.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = this._generateToken(user);
    return { user: this._sanitize(user), token };
  }

  async login({ email, password }) {
    const user = userRepo.findOne((u) => u.email === email);
    if (!user) {
      const err = new Error("Credenciales inválidas");
      err.statusCode = 401;
      throw err;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      const err = new Error("Credenciales inválidas");
      err.statusCode = 401;
      throw err;
    }

    const token = this._generateToken(user);
    return { user: this._sanitize(user), token };
  }

  getProfile(userId) {
    const user = userRepo.findById(userId);
    if (!user) {
      const err = new Error("Usuario no encontrado");
      err.statusCode = 404;
      throw err;
    }
    return this._sanitize(user);
  }

  _generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  _sanitize(user) {
    const { password, ...safe } = user;
    return safe;
  }
}

module.exports = new AuthService();
