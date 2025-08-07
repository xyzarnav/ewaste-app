import React, { useState } from 'react';
import { registerContact } from '../services/adminService';

function getLocationAbbr(location) {
  return location.split(/\s|,|\./).filter(Boolean).map(w => w[0].toUpperCase()).join('');
}

export default function RegisterContact({ companyId = 'GE-1', department = '', location = '' }) {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    department: department,
    title: '',
    address: '',
    location: location,
  });
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const locAbbr = getLocationAbbr(fields.location);
    const contactId = `${companyId}-${fields.department}-${locAbbr}`;
    setLoading(true);
    await registerContact({ ...fields, companyId, contactId });
    setConfirmation(`Contact registered! Contact ID: ${contactId}`);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-xl mx-auto mt-6">
      <h3 className="text-lg font-bold mb-2">Register Contact</h3>
      <input name="name" value={fields.name} onChange={handleChange} placeholder="Name" className="w-full border p-2 rounded" required />
      <input name="email" value={fields.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" required />
      <input name="phone" value={fields.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border p-2 rounded" required />
      <input name="department" value={fields.department} onChange={handleChange} placeholder="Department" className="w-full border p-2 rounded" required />
      <input name="title" value={fields.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" required />
      <input name="address" value={fields.address} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded" required />
      <input name="location" value={fields.location} onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded" required />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Registering...' : 'Register Contact'}</button>
      {confirmation && <div className="text-green-700 mt-2">{confirmation}</div>}
    </form>
  );
}
