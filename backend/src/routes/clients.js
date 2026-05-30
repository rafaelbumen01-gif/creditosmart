const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const ctrl = require("../controllers/clientController");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Nombre requerido"),
    body("cedula").notEmpty().withMessage("Cédula requerida"),
  ],
  validate,
  ctrl.create
);

router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.delete);

module.exports = router;
