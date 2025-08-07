import React, { useEffect, useState } from 'react';
import { getCompanyContacts } from '../services/adminService';
import ContactCard from './ContactCard';

export default function ContactList({ companyId, filter = {} }) {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    getCompanyContacts(companyId).then((res) => setContacts(res.contacts));
  }, [companyId]);

  const filtered = contacts.filter((c) => {
    let match = true;
    if (filter.department) match = match && c.department === filter.department;
    if (filter.location) match = match && c.location === filter.location;
    return match;
  });

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mt-6">
      <h3 className="text-lg font-bold mb-2">Contacts</h3>
      {filtered.map((contact) => (
        <ContactCard key={contact.contactId + contact.email} contact={contact} />
      ))}
      {filtered.length === 0 && <div>No contacts found.</div>}
    </div>
  );
}
