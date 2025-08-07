import React, { useState } from 'react';
import { updateClientStatus, sendInviteEmail } from '../services/adminService';

export default function ClientProfile({ client, onStatusChange }) {
  const [fields, setFields] = useState({
    poc: client.poc,
    phone: client.phone,
    email: client.email,
    address: client.address || '',
    status: client.status || 'prospect',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setFields((f) => ({ ...f, status: newStatus }));
    setLoading(true);
    await updateClientStatus(client.companyId, newStatus);
    if (newStatus === 'active') {
      await sendInviteEmail(fields.email, client.companyId);
      setMessage('Invitation email sent!');
    }
    setLoading(false);
    if (onStatusChange) onStatusChange(newStatus);
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl mx-auto mt-6">
      <h3 className="text-lg font-bold mb-2">Client Profile: {client.companyId}</h3>
      <input name="poc" value={fields.poc} onChange={handleChange} placeholder="Point of Contact" className="w-full border p-2 rounded mb-2" />
      <input name="phone" value={fields.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border p-2 rounded mb-2" />
      <input name="email" value={fields.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded mb-2" />
      <input name="address" value={fields.address} onChange={handleChange} placeholder="Address" className="w-full border p-2 rounded mb-2" />
      <label className="block mb-2">Status
        <select name="status" value={fields.status} onChange={handleStatusChange} className="w-full border p-2 rounded">
          <option value="prospect">Prospect</option>
          <option value="active">Active</option>
        </select>
      </label>
      {loading && <div>Updating...</div>}
      {message && <div className="text-green-700 mt-2">{message}</div>}
    </div>
  );
}
