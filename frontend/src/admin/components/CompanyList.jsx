import React, { useState } from 'react';
import ClientProfile from './ClientProfile';

// Dummy company list for demo
const dummyCompanies = [
  {
    companyId: 'GE-1',
    companyName: 'GE Aviation',
    location: '1 Neumann Way, Cincinnati, OH 45215',
    phone: '(513) 243-2000',
    poc: 'Jessica Shoomer',
    title: 'IT Head',
    email: 'J.shoomer@GE.com',
    status: 'prospect',
    address: '1 Neumann Way, Cincinnati, OH 45215',
  },
  {
    companyId: 'GE-2',
    companyName: 'GE Global',
    location: '191 Rosa Parks St, Cincinnati, OH 45215',
    phone: '(513) 555-2000',
    poc: 'Brian Fox',
    title: 'IT Director',
    email: 'b.fox@GE.com',
    status: 'active',
    address: '191 Rosa Parks St, Cincinnati, OH 45215',
  },
];

export default function CompanyList() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto mt-6">
      <h3 className="text-lg font-bold mb-2">Companies</h3>
      {dummyCompanies.map((c) => (
        <div key={c.companyId} className="mb-2">
          <button className="text-blue-600 underline" onClick={() => setSelected(c)}>{c.companyName} ({c.companyId})</button>
        </div>
      ))}
      {selected && <ClientProfile client={selected} />}
    </div>
  );
}
