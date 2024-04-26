import React, { createContext, useContext, useState } from 'react';
import Notification from '../components/universal/Notification';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState('');

  const triggerNotification = (msg) => {
    console.log("Message: ", msg);
    setMessage(msg);
    setTimeout(() => setMessage(''), 3600); // Reset after the animation
  };

  return (
    <NotificationContext.Provider value={triggerNotification}>
      {children}
      {message ? <Notification message={message} /> : null}
    </NotificationContext.Provider>
  );
};
