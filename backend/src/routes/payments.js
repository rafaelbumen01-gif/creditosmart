const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/paymentController");

router.get("/", ctrl.getAll);
router.get("/stats", ctrl.stats);
router.get("/loan/:loanId", ctrl.getByLoan);

router.post(
  "/",
  [
    body("loanId").notEmpty().withMessage("Préstamo requerido"),
    body("amount").isNumeric().withMessage("Monto inválido"),
  ],
  validate,
  ctrl.create
);

module.exports = router;
