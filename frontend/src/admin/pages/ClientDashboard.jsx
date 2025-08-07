import React from 'react';
import PickupForm from '../components/PickupForm';
import MetricsDashboard from '../components/MetricsDashboard';
import ContactList from '../components/ContactList';

export default function ClientDashboard({ companyId = 'GE-1' }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Client Dashboard</h2>
      <PickupForm companyId={companyId} />
      <MetricsDashboard companyId={companyId} />
      <ContactList companyId={companyId} />
    </div>
  );
}
