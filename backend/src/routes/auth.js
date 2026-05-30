const router = require("express").Router();
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");
const ctrl = require("../controllers/authController");

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Nombre requerido"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("Mínimo 6 caracteres"),
  ],
  validate,
  ctrl.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Contraseña requerida"),
  ],
  validate,
  ctrl.login
);

router.get("/profile", auth, ctrl.profile);

module.exports = router;
