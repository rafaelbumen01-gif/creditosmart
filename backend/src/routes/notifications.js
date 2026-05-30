const router = require("express").Router();
const ctrl = require("../controllers/notificationController");

router.get("/", ctrl.getAll);
router.get("/unread-count", ctrl.unreadCount);
router.post("/", ctrl.create);
router.patch("/:id/read", ctrl.markAsRead);
router.patch("/read-all", ctrl.markAllAsRead);

module.exports = router;
