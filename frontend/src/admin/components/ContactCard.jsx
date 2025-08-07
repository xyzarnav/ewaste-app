import React from 'react';

export default function ContactCard({ contact, onEdit }) {
  return (
    <div className="border rounded p-4 mb-2 bg-gray-50">
      <div className="font-bold">{contact.name} <span className="text-xs text-gray-500">({contact.title})</span></div>
      <div className="text-sm">Email: {contact.email}</div>
      <div className="text-sm">Phone: {contact.phone}</div>
      <div className="text-sm">Department: {contact.department}</div>
      <div className="text-sm">Location: {contact.location}</div>
      <div className="text-sm">Address: {contact.address}</div>
      <div className="text-xs text-gray-400">Contact ID: {contact.contactId}</div>
      {onEdit && <button className="mt-2 px-2 py-1 bg-blue-600 text-white rounded" onClick={() => onEdit(contact)}>Edit</button>}
    </div>
  );
}
