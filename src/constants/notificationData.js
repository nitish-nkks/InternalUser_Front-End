export const notificationData = [
  {
    id: 1,
    title: "New Order Received",
    description: "Order #1234 for 10kg poultry feed from Rajesh Kumar",
    date: "Aug 11, 2:15 PM",
    isRead: false,
    type: "order",
    priority: "high",
    details: "A new order has been placed for 10kg Premium Poultry Layer Feed. The customer has requested delivery within 2 days. Order value: ₹2,450. Please process this order at the earliest."
  },
  {
    id: 2,
    title: "Low Stock Alert",
    description: "Shrimp Starter Feed is running low (only 3 bags left)",
    date: "Aug 11, 1:30 PM",
    isRead: false,
    type: "inventory",
    priority: "critical",
    details: "Critical stock alert: Shrimp Starter Feed inventory has dropped to just 3 bags remaining. This is below the minimum threshold of 10 bags. Please reorder immediately to avoid stockouts."
  },
  {
    id: 3,
    title: "Order Shipped",
    description: "Order #1230 has been shipped to Mohammed Ali",
    date: "Aug 11, 11:45 AM",
    isRead: true,
    type: "order",
    priority: "medium",
    details: "Order #1230 containing 25kg Fish Growth Booster has been successfully shipped via BlueDart. Tracking ID: BD123456789. Expected delivery: Aug 13, 2025."
  },
  {
    id: 4,
    title: "Payment Received",
    description: "Payment of ₹5,200 received for Order #1228",
    date: "Aug 11, 10:20 AM",
    isRead: true,
    type: "payment",
    priority: "medium",
    details: "Payment confirmation: ₹5,200 has been successfully received for Order #1228 via UPI. Transaction ID: T456789123. The order is now ready for processing and dispatch."
  },
  {
    id: 5,
    title: "New Customer Registration",
    description: "Sunita Patel has registered as a new customer",
    date: "Aug 10, 6:45 PM",
    isRead: false,
    type: "customer",
    priority: "low",
    details: "Welcome a new customer to Feedora! Sunita Patel from Ahmedabad has successfully registered. Customer profile includes: Poultry farming with 500 birds, looking for premium layer feed solutions."
  }
];

export const getUnreadCount = () => {
  return notificationData.filter(notification => !notification.isRead).length;
};

export const markAsRead = (notificationId) => {
  const notification = notificationData.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

export const markAllAsRead = () => {
  notificationData.forEach(notification => {
    notification.isRead = true;
  });
};

export const clearAllNotifications = () => {
  notificationData.splice(0, notificationData.length);
};

export const getTotalCount = () => {
  return notificationData.length;
};