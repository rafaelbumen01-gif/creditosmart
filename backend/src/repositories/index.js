const JsonRepository = require("./JsonRepository");

module.exports = {
  userRepo: new JsonRepository("users"),
  clientRepo: new JsonRepository("clients"),
  loanRepo: new JsonRepository("loans"),
  paymentRepo: new JsonRepository("payments"),
  notificationRepo: new JsonRepository("notifications"),
};
