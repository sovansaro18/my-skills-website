import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, Check, Info, BookOpen, Star, X, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';

// កំណត់ Type សម្រាប់ Notification
interface Notification {
  _id: string;
  type: 'lesson' | 'homework' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // 👇 State សម្រាប់ទុកសារដែលត្រូវបង្ហាញក្នុង Popup
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
    if (user) {
        fetchNotifications();
    }
    
    const interval = setInterval(() => {
        if(user) fetchNotifications();
    }, 60000); 

    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch('http://localhost:5000/api/notifications', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
            const data = await res.json();
            if(Array.isArray(data)) {
                setNotifications(data);
            }
        }
    } catch (error) {
        console.error("Error fetching notifications:", error);
    }
  };

  const markAllAsRead = async () => {
    const updatedNotifs = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifs);

    try {
        const token = localStorage.getItem("token");
        await fetch('http://localhost:5000/api/notifications/mark-all-read', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error("Error marking all as read:", error);
    }
  };

  // 👇 កែសម្រួល៖ ពេលចុចលើសារ គឺបើក Popup ហើយ Mark as read
  const handleNotificationClick = async (notification: Notification) => {
    // ១. បើក Popup បង្ហាញសារ
    setSelectedNotification(notification);
    // ២. បិទ Dropdown តូច
    setIsOpen(false);

    // ៣. បើវាមិនទាន់អាន ធ្វើការ Mark as read
    if (!notification.isRead) {
        const updatedNotifs = notifications.map(n => 
            n._id === notification._id ? { ...n, isRead: true } : n
        );
        setNotifications(updatedNotifs);

        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:5000/api/notifications/${notification._id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
             console.error("Error marking as read:", error);
        }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen size={18} className="text-blue-500" />;
      case 'homework': return <Star size={18} className="text-yellow-500" />;
      default: return <Info size={18} className="text-slate-500" />;
    }
  };

  const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diff < 60) return 'មុននេះបន្តិច';
      if (diff < 3600) return `${Math.floor(diff / 60)} នាទីមុន`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} ម៉ោងមុន`;
      return `${Math.floor(diff / 86400)} ថ្ងៃមុន`;
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('km-KH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
              />

              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-80 md:w-96 bg-white dark:bg-slate-900 shadow-2xl z-[9999] border-l border-slate-200 dark:border-slate-800 flex flex-col"
              >
                
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                  <div>
                      <h3 className="font-bold text-lg font-khmer text-slate-900 dark:text-white">ដំណឹង</h3>
                      <p className="text-xs text-slate-500 font-khmer mt-0.5">អ្នកមាន {unreadCount} ដំណឹងមិនទាន់អាន</p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                          <button
                              onClick={markAllAsRead}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full"
                              title="Mark all as read"
                          >
                              <Check size={18} />
                          </button>
                      )}
                      <button 
                          onClick={() => setIsOpen(false)}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                      >
                          <X size={20} />
                      </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                  {notifications.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 font-khmer space-y-4">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                          <Bell size={32} className="text-slate-300" />
                      </div>
                      <p>គ្មានដំណឹងថ្មីទេ</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                          <div
                          key={notification._id}
                          // 👇 ហៅ function ថ្មី
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 rounded-xl cursor-pointer transition-all border ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}
                          >
                          <div className="flex gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notification.isRead ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 grayscale'}`}>
                                  {getIcon(notification.type)}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start mb-1">
                                      <h4 className={`text-sm font-bold font-khmer truncate pr-2 ${!notification.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                          {notification.title}
                                      </h4>
                                      {!notification.isRead && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1.5"></span>}
                                  </div>
                                  
                                  <p className={`text-sm font-khmer leading-relaxed line-clamp-2 mb-2 ${!notification.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>
                                      {notification.message}
                                  </p>
                                  
                                  <div className="flex items-center gap-1 text-xs text-slate-400 font-khmer">
                                      <Clock size={12} />
                                      {formatTime(notification.createdAt)}
                                  </div>
                              </div>
                          </div>
                          </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* 👇 ផ្នែកថ្មី៖ Popup បង្ហាញសារលម្អិត */}
      {mounted && createPortal(
        <AnimatePresence>
            {selectedNotification && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedNotification(null)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                                {getIcon(selectedNotification.type)}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-khmer leading-tight mb-1">
                                    {selectedNotification.title}
                                </h2>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-khmer">
                                    <Calendar size={12} />
                                    {formatFullDate(selectedNotification.createdAt)}
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedNotification(null)}
                                className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="font-khmer text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedNotification.message}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button 
                                onClick={() => setSelectedNotification(null)}
                                className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all active:scale-95 font-khmer"
                            >
                                បិទ
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default NotificationDropdown;