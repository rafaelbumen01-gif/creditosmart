const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  jwt: {
    secret: process.env.JWT_SECRET || "fallback_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  dataDir: path.resolve(__dirname, "../data"),
};
