import React, { useState } from 'react';
import { schedulePickup } from '../services/adminService';

function getLocationAbbr(location) {
  return location.split(/\s|,|\./).filter(Boolean).map(w => w[0].toUpperCase()).join('');
}

export default function PickupForm({ companyId, onBatchCreated }) {
  const [fields, setFields] = useState({
    pickupDate: '',
    department: '',
    location: '',
  });
  const [pickupNumber, setPickupNumber] = useState(1); // In real app, fetch/generate this
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const locAbbr = getLocationAbbr(fields.location);
    const dateStr = fields.pickupDate.replace(/-/g, '').slice(6,8) + fields.pickupDate.replace(/-/g, '').slice(4,6) + fields.pickupDate.replace(/-/g, '').slice(0,4);
    const batchId = `${companyId}-${fields.department}-${locAbbr}-${pickupNumber}-${dateStr}`;
    setLoading(true);
    await schedulePickup({ ...fields, companyId, batchId });
    setConfirmation(`Batch scheduled! Batch ID: ${batchId}`);
    setLoading(false);
    setPickupNumber((n) => n + 1);
    if (onBatchCreated) onBatchCreated(batchId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-xl mx-auto mt-6">
      <h3 className="text-lg font-bold mb-2">Schedule Pickup</h3>
      <input name="pickupDate" type="datetime-local" value={fields.pickupDate} onChange={handleChange} className="w-full border p-2 rounded" required />
      <input name="department" value={fields.department} onChange={handleChange} placeholder="Department" className="w-full border p-2 rounded" required />
      <input name="location" value={fields.location} onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded" required />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Scheduling...' : 'Schedule Pickup'}</button>
      {confirmation && <div className="text-green-700 mt-2">{confirmation}</div>}
    </form>
  );
}
