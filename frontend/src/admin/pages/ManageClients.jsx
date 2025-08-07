import React, { useState } from 'react';
import ClientForm from '../components/ClientForm';
import ContactList from '../components/ContactList';
import MetricsDashboard from '../components/MetricsDashboard';
import CompanyList from '../components/CompanyList';

export default function ManageClients() {
  const [companyId, setCompanyId] = useState('GE-1'); // Demo default, update after client creation
  const [showMetrics, setShowMetrics] = useState(false);

  const handleClientCreated = (data) => {
    setCompanyId(data.companyId);
    setShowMetrics(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <ClientForm onClientCreated={handleClientCreated} />
      </div>
      <CompanyList />
      {showMetrics && (
        <>
          <MetricsDashboard companyId={companyId} />
          <ContactList companyId={companyId} />
        </>
      )}
    </div>
  );
}
