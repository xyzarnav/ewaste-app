import React, { useState } from 'react';
import { createClient } from '../services/adminService';

function getAbbreviation(name) {
  return name
    .split(' ')
    .map((w) => w[0].toUpperCase())
    .join('');
}

export default function ClientForm({ onClientCreated }) {
  const [fields, setFields] = useState({
    companyName: '',
    location: '',
    phone: '',
    poc: '',
    title: '',
    email: '',
    meeting: '',
    rygnContacts: [],
    agenda: '',
  });
  const [clientNumber, setClientNumber] = useState(1); // In real app, fetch/generate this
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const options = Array.from(e.target.selectedOptions, (o) => o.value);
    setFields((f) => ({ ...f, rygnContacts: options }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const abbr = getAbbreviation(fields.companyName);
    const companyId = `${abbr}-${clientNumber}`;
    const data = { ...fields, companyId };
    await createClient(data);
    setConfirmation(`Client created! Company ID: ${companyId}`);
    setLoading(false);
    setClientNumber((n) => n + 1);
    if (onClientCreated) onClientCreated(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h3 className="text-lg font-bold mb-2">Add New Client</h3>
      <input name="companyName" value={fields.companyName} onChange={handleChange} placeholder="Company Name" className="w-full border p-2 rounded" required />
      <input name="location" value={fields.location} onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded" required />
      <input name="phone" value={fields.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border p-2 rounded" required />
      <input name="poc" value={fields.poc} onChange={handleChange} placeholder="Point of Contact" className="w-full border p-2 rounded" required />
      <input name="title" value={fields.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" required />
      <input name="email" value={fields.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" required />
      <label className="block">Scheduled First Meeting
        <input type="datetime-local" name="meeting" value={fields.meeting} onChange={handleChange} className="w-full border p-2 rounded" required />
      </label>
      <label className="block">RYGNeco Person of Contact
        <select multiple name="rygnContacts" value={fields.rygnContacts} onChange={handleMultiSelect} className="w-full border p-2 rounded">
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
          <option value="Charlie">Charlie</option>
        </select>
      </label>
      <textarea name="agenda" value={fields.agenda} onChange={handleChange} placeholder="Meeting Agenda" className="w-full border p-2 rounded" />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Saving...' : 'Create Client'}</button>
      {confirmation && <div className="text-green-700 mt-2">{confirmation}</div>}
    </form>
  );
}
