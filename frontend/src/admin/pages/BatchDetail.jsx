import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MapPin, 
  User, 
  Building, 
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CheckSquare
} from 'lucide-react';
import { batchAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const BatchDetail = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    fetchBatchDetails();
  }, [batchId]);

  const fetchBatchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await batchAPI.getBatch(batchId);
      setBatch(response.data);
    } catch (err) {
      console.error('Error fetching batch details:', err);
      setError(err.message || 'Failed to fetch batch details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, text: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <IconComponent className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const handleCompleteBatch = async () => {
    try {
      setIsCompleting(true);
      await batchAPI.updateBatchStatus(batch._id, 'completed');
      
      toast({
        title: "Success!",
        description: `Batch ${batch.batchId} has been marked as completed`,
        variant: "default",
      });
      
      // Refresh batch data
      await fetchBatchDetails();
    } catch (error) {
      console.error('Error completing batch:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete batch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading batch details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-2">Error loading batch details</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchBatchDetails} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Batch not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900">Batch Details</h1>
            <p className="text-gray-600">View and manage batch information</p>
          </div>
        </div>

        {/* Batch Information */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <Package className="h-6 w-6" />
                <span>{batch.batchId}</span>
                {getStatusBadge(batch.status)}
              </CardTitle>
              <div className="flex space-x-2">
                {(batch.status === 'pending' || batch.status === 'in_progress') && (
                  <Button
                    onClick={() => navigate(`/admin/batch/${batch._id}/add-items`)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{batch.status === 'pending' ? 'Add Items' : 'Add More Items'}</span>
                  </Button>
                )}
                {batch.status === 'in_progress' && batch.items && batch.items.length > 0 && (
                  <Button
                    onClick={handleCompleteBatch}
                    disabled={isCompleting}
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  >
                    {isCompleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Completing...</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-4 w-4" />
                        <span>Complete Batch</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Batch Name</p>
                    <p className="text-lg font-semibold">{batch.batchName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Organization</p>
                    <p className="text-lg font-semibold">{batch.createdBy?.organizationName || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contact Person</p>
                    <p className="text-lg font-semibold">{batch.contactPerson}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pickup Location</p>
                    <p className="text-lg font-semibold">{batch.pickupLocation}</p>
                  </div>
                </div>
                
                {batch.department && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Department</p>
                      <p className="text-lg font-semibold">{batch.department}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Request Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(batch.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {batch.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                <p className="text-gray-700">{batch.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Items ({batch.items?.length || 0})</span>
              </CardTitle>
              {batch.status === 'in_progress' && batch.items && batch.items.length > 0 && (
                <Button
                  onClick={handleCompleteBatch}
                  disabled={isCompleting}
                  size="sm"
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                >
                  {isCompleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Completing...</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4" />
                      <span>Complete Batch</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!batch.items || batch.items.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No items have been added to this batch yet.</p>
                {batch.status === 'pending' && (
                  <Button
                    onClick={() => navigate(`/admin/batch/${batch._id}/add-items`)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Items</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {batch.items.map((item, index) => (
                  <Card key={index} className="border-l-4 border-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold">{item.itemName}</h4>
                            <Badge variant="outline">{item.stockType}</Badge>
                            <Badge variant={item.condition === 'working' ? 'default' : 'secondary'}>
                              {item.condition}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Model/Serial</p>
                              <p className="font-medium">{item.modelSerial || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Quantity</p>
                              <p className="font-medium">{item.quantity}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Estimated Value</p>
                              <p className="font-medium">${item.estimatedValue || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">CO2 Impact</p>
                              <p className="font-medium">{item.co2Estimate || 'N/A'} kg</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Priority</p>
                              <p className="font-medium capitalize">{item.priority}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Hazard Level</p>
                              <p className="font-medium capitalize">{item.hazardLevel}</p>
                            </div>
                          </div>
                          
                          {item.description && (
                            <div className="mt-3">
                              <p className="text-gray-500 text-sm">Description</p>
                              <p className="text-sm">{item.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BatchDetail;
