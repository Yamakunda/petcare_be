const Notification = require('../models/notification.model'); // Ensure you have the correct path to your Notification model

// Get all notifications
module.exports.getUserNotifications = async (req, res) => {
  const { id } = req;
  try {
    const notifications = await Notification.find({ user_id : id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
    //seen notification
    await Notification.updateMany({ user_id: id, status: 'Chưa đọc' }, { $set: { status: 'Đã đọc' } });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getUserListNotifications = async (req, res) => {
  const { user_id } = req.params;
  try {
    const notifications = await Notification.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// Get a single notification by ID
module.exports.getNotificationById = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(notification);
    //update seen status
    await Notification.findByIdAndUpdate(id, { status: 'Đã đọc' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new notification
module.exports.createNotification = async (req, res) => {
  // const { user_id, title, content, status } = req.body;
  try {
    console.log(req.body);
    const notification = new Notification(req.body);
    await notification.save();
    console.log(notification);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a notification by ID
module.exports.updateNotification = async (req, res) => {
  const { id } = req.params;
  const { user_id, Title, content, status } = req.body;
  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { user_id, Title, content, status },
      { new: true, useFindAndModify: false }
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a notification by ID
module.exports.deleteNotification = async (req, res) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};