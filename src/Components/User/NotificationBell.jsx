import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, BellRing, CheckCircle, AlertCircle } from "lucide-react";
import moment from "moment";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

const NotificationBell = ({ userId }) => {
  const [reminders, setReminders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (userId) fetchReminders();
  }, [userId]);

  const fetchReminders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/user-retrieveAdminPaymentReminder/${userId}`
      );
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setReminders(data);
      setUnreadCount(data.filter(item => !item.read).length);
    } catch (error) {
      console.error("Error fetching reminders", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      console.log("Inside frontend markAsRead");
      await axios.put(`http://localhost:3000/user-mark-notification-read/${id}`);
      fetchReminders();
      console.log("markAsRead button triggered");
      
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      console.log("Inside frontend markAllAsRead");
      await axios.post(`http://localhost:3000/user-mark-all-notifications-read`, { userId });
      fetchReminders();
      console.log("markAllAsRead button triggered");

    } catch (error) {
      console.error("Error marking all notifications as read", error);
    }
  };

  return (
    <div >
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen} style={{width:"800px"}}>
      <Dialog.Trigger asChild>
        <button className="absolute top-7 right-7 p-2 hover:bg-gray-100 rounded-full transition-colors bg-success" style={{width:"42px",height:"42px"}}>
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-20 right-4 bg-white rounded-lg shadow-xl w-90 max-h-[70vh] overflow-hidden flex flex-col"
              >

<Dialog.Title className="sr-only">Notifications</Dialog.Title>

                <div className="p-4 px-5 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Notifications
                  </h2>
                  {reminders.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 rounded-5 ms-3"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto flex-1">
                  {reminders.length > 0 ? (
                    reminders.map((reminder) => (
                      <motion.div
                        key={reminder._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-start gap-3"
                      >
                        <div className="flex-shrink-0 pt-1">
                          {reminder.type === 'alert' ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <BellRing className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            {reminder.message}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {moment(reminder.createdAt).fromNow()}
                            </span>
                            {!reminder.read && (
                              <button
                                onClick={() => markAsRead(reminder._id)}
                                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 rounded-5 p-2 mt-3" style={{width:"100px"}}
                              >
                                <CheckCircle className="w-5 h-4 " />
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <div className="inline-block p-3 bg-gray-100 rounded-full mb-3">
                        <Bell className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        No new notifications
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <p className="text-center text-sm text-gray-500">
                    You're all caught up! 🎉
                  </p>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
    </div>
  );
};

export default NotificationBell;