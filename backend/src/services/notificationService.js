const { notificationRepo } = require("../repositories");

class NotificationService {
  getAll(filter = {}) {
    const notifs = notificationRepo.findAll(filter);
    return notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  create(data) {
    return notificationRepo.create({
      type: data.type || "info", // urgent | warning | info
      title: data.title,
      message: data.message,
      read: false,
    });
  }

  markAsRead(id) {
    return notificationRepo.update(id, { read: true });
  }

  markAllAsRead() {
    const notifs = notificationRepo.findAll();
    notifs.forEach((n) => {
      if (!n.read) notificationRepo.update(n.id, { read: true });
    });
    return { updated: notifs.filter((n) => !n.read).length };
  }

  getUnreadCount() {
    return notificationRepo.findAll().filter((n) => !n.read).length;
  }
}

module.exports = new NotificationService();
