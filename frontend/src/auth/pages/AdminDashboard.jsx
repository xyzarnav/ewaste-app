import React, { useState } from 'react';
import AdminBatchDashboard from '@/components/AdminBatchDashboard';
import AdminItemForm from '@/components/AdminItemForm';

export default function AdminDashboard() {
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'items'

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setView('items');
  };

  const handleSaveItems = (updatedBatch) => {
    // TODO: Update the batch in the dashboard
    console.log('Batch updated with items:', updatedBatch);
    setView('dashboard');
    setSelectedBatch(null);
  };

  const handleCancel = () => {
    setView('dashboard');
    setSelectedBatch(null);
  };

  if (view === 'items' && selectedBatch) {
    return (
      <AdminItemForm
        batch={selectedBatch}
        onSave={handleSaveItems}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <AdminBatchDashboard onBatchSelect={handleBatchSelect} />
  );
}
