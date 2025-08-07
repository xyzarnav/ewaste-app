import React, { useEffect, useState } from 'react';
import { getInventoryMetrics } from '../services/adminService';

export default function MetricsDashboard({ companyId }) {
  const [metrics, setMetrics] = useState(null);
  useEffect(() => {
    getInventoryMetrics(companyId).then((res) => setMetrics(res.metrics));
  }, [companyId]);

  if (!metrics) return <div>Loading metrics...</div>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mt-6">
      <h3 className="text-lg font-bold mb-2">Inventory Metrics</h3>
      <div className="mb-4">
        <div className="font-semibold">Contacts:</div>
        {metrics.contacts.map((c) => (
          <div key={c.contactId}>{c.name} ({c.contactId}): {c.lbs} lbs</div>
        ))}
      </div>
      <div className="mb-4">
        <div className="font-semibold">Departments:</div>
        {metrics.departments.map((d) => (
          <div key={d.department}>{d.department}: {d.lbs} lbs</div>
        ))}
      </div>
      <div className="mb-4">
        <div className="font-semibold">Branches:</div>
        {metrics.branches.map((b) => (
          <div key={b.branch}>{b.branch}: {b.lbs} lbs</div>
        ))}
      </div>
      <div className="font-bold">Company Total: {metrics.companyTotal} lbs</div>
    </div>
  );
}
