import { createContext, useState } from "react";

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [messagesUpdated, setMessagesUpdated] = useState(false);


  return (
    <MessageContext.Provider value={{ selectedMessageId, setSelectedMessageId,  messagesUpdated,
      setMessagesUpdated }}>
      {children}
    </MessageContext.Provider>
  );
};



