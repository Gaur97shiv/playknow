export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({to:userId}).populate('from', 'username profilePicture').sort({ createdAt: -1 });
    if (!notifications) {
      return res.status(404).json({ message: 'No notifications found' });
    }
    await Notification.updateMany({ to: userId }, { read: true });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.deleteMany({ to: userId });
    res.status(200).json({ message: 'Notifications deleted successfully' });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}