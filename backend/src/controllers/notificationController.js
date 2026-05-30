const notificationService = require("../services/notificationService");

exports.getAll = (req, res, next) => {
  try {
    res.json(notificationService.getAll());
  } catch (err) {
    next(err);
  }
};

exports.create = (req, res, next) => {
  try {
    res.status(201).json(notificationService.create(req.body));
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = (req, res, next) => {
  try {
    const result = notificationService.markAsRead(req.params.id);
    if (!result) return res.status(404).json({ error: "Notificación no encontrada" });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = (req, res, next) => {
  try {
    res.json(notificationService.markAllAsRead());
  } catch (err) {
    next(err);
  }
};

exports.unreadCount = (req, res, next) => {
  try {
    res.json({ count: notificationService.getUnreadCount() });
  } catch (err) {
    next(err);
  }
};
