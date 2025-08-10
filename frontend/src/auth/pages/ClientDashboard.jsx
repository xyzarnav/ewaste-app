import React, { useState } from 'react';
import PartnerBatchForm from '@/components/PartnerBatchForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Calendar, 
  MapPin, 
  User, 
  Plus,
  CheckCircle
} from 'lucide-react';

export default function ClientDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [submittedBatches, setSubmittedBatches] = useState([]);

  const handleBatchCreated = (batchData) => {
    setSubmittedBatches(prev => [batchData, ...prev]);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showForm) {
    return (
      <PartnerBatchForm 
        onBatchCreated={handleBatchCreated}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Partner Dashboard</h1>
          <p className="text-gray-600">Request e-waste pickup and track your submissions</p>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to request e-waste pickup?</h3>
                <p className="text-gray-600">Submit a new batch request for your organization</p>
              </div>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Pickup Request
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Your Recent Requests ({submittedBatches.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submittedBatches.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
                <p className="text-gray-500 mb-6">
                  You haven't submitted any e-waste pickup requests yet.
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Submit Your First Request
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {submittedBatches.map((batch) => (
                  <div
                    key={batch.batchId}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {batch.batchName}
                          </h3>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Submitted
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-emerald-600" />
                            <span className="font-medium">Batch ID:</span>
                            <span className="font-mono text-emerald-700">{batch.batchId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{batch.contactPerson}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(batch.requestDate)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>{batch.pickupLocation}</span>
                        </div>
                        
                        {batch.department && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Department:</strong> {batch.department}
                          </div>
                        )}
                        
                        {batch.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Notes:</strong> {batch.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs text-gray-500">
                          Submitted: {formatDate(batch.createdAt)}
                        </div>
                        <div className="text-sm text-emerald-600 font-medium">
                          Waiting for admin to add items
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your request has been submitted to our admin team</li>
                <li>• An admin will review your request and add detailed item information</li>
                <li>• You'll receive updates on pickup scheduling and completion</li>
                <li>• Track your environmental impact through our reporting system</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
