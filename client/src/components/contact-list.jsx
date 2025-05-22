import { useAppStore } from '@/stores';
import React from 'react';

const ContactList = ({ contacts, isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact");
    }
    // console.log("id of selected data:",selectedChatData._id)
    if (!selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }

    setSelectedChatData(contact);
     // Don't forget to actually set selected contact
     console.log("contact is:",contact)
  };


  return (
    <div className='mt-5'>
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className='p-2 hover:bg-gray-100 cursor-pointer rounded-md'
          onClick={() => handleClick(contact)}
        >
          {contact.name || contact._id}
        </div>
      ))}
    </div>
  );
};

export default ContactList;
