import React, { createContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('stitched_notifications')) || [];
    } catch {
      return [];
    }
  });

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('stitched_notifications', JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type, // 'order', 'promo', 'info', 'success'
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Order lifecycle notifications
  const triggerOrderNotifications = (orderId) => {
    addNotification('Order Placed', `Order ${orderId} has been confirmed!`, 'order');
    
    setTimeout(() => {
      addNotification('Order Shipped', `Order ${orderId} is on its way! 🚚`, 'order');
    }, 3000);
    
    setTimeout(() => {
      addNotification('Order Delivered', `Order ${orderId} has been delivered! ✅`, 'order');
    }, 6000);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllRead,
        clearNotifications,
        triggerOrderNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
