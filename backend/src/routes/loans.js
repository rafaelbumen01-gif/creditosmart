const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/loanController");

router.get("/", ctrl.getAll);
router.get("/dashboard", ctrl.dashboard);
router.get("/:id", ctrl.getById);
router.get("/:id/amortization", ctrl.amortization);

router.post(
  "/",
  [
    body("clientId").notEmpty().withMessage("Cliente requerido"),
    body("amount").isNumeric().withMessage("Monto inválido"),
    body("rate").isNumeric().withMessage("Tasa inválida"),
    body("term").isInt({ min: 1 }).withMessage("Plazo inválido"),
  ],
  validate,
  ctrl.create
);

router.post("/simulate", ctrl.simulate);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.delete);

module.exports = router;
