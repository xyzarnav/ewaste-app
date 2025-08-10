import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
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
  RefreshCw,
  Home,
  CheckSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { batchAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completingBatches, setCompletingBatches] = useState(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch batches from API
  const fetchBatches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      
             const response = await batchAPI.getBatches(params);
      
      setBatches(response.data || []);
      setFilteredBatches(response.data || []);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setError(err.message || 'Failed to fetch batches');
      setBatches([]);
      setFilteredBatches([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBatches();
  }, []);

  // Refetch when status filter changes
  useEffect(() => {
    fetchBatches();
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBatches();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Refresh batches when returning to dashboard
  useEffect(() => {
    const handleFocus = () => {
      fetchBatches();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

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

  const handleViewBatch = (batchId) => {
    navigate(`/admin/batch/${batchId}`);
  };

  const handleCompleteBatch = async (batchId, batchName) => {
    try {
      setCompletingBatches(prev => new Set(prev).add(batchId));
      await batchAPI.updateBatchStatus(batchId, 'completed');
      
      toast({
        title: "Success!",
        description: `Batch ${batchName} has been marked as completed`,
        variant: "default",
      });
      
      // Refresh batches
      await fetchBatches();
    } catch (error) {
      console.error('Error completing batch:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete batch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompletingBatches(prev => {
        const newSet = new Set(prev);
        newSet.delete(batchId);
        return newSet;
      });
    }
  };

  const getStats = () => {
    const pending = batches.filter(b => b.status === 'pending').length;
    const inProgress = batches.filter(b => b.status === 'in_progress').length;
    const completed = batches.filter(b => b.status === 'completed').length;
    const totalItems = batches.reduce((sum, b) => sum + (b.items?.length || 0), 0);

    return { pending, inProgress, completed, totalItems };
  };

  const stats = getStats();

  if (isLoading && batches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading batches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <Button
              onClick={fetchBatches}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
          <p className="text-xl text-gray-600">
            Manage e-waste pickup requests and add item details
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalItems}</p>
                </div>
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Batch Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by Batch ID, Name, Contact, or Organization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('in_progress')}
                  size="sm"
                >
                  In Progress
                </Button>
                <Button
                  variant={statusFilter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('completed')}
                  size="sm"
                >
                  Completed
                </Button>
              </div>
            </div>

            {/* Batch List */}
            <div className="space-y-4">
              {error && (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-600 mb-2">Error loading batches</p>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button onClick={fetchBatches} variant="outline">
                    Try Again
                  </Button>
                </div>
              )}
              
              {!error && filteredBatches.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No batches found matching your criteria.</p>
                </div>
              ) : (
                                 <>
                   {isLoading && (
                     <div className="text-center py-4">
                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                       <p className="text-sm text-gray-600 mt-2">Refreshing...</p>
                     </div>
                   )}
                                       {filteredBatches.map((batch) => (
                      <Card key={batch._id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {batch.batchId}
                                </h3>
                                {getStatusBadge(batch.status)}
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Package className="h-4 w-4" />
                                    <span className="font-medium">Batch:</span>
                                    <span>{batch.batchName}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Building className="h-4 w-4" />
                                    <span className="font-medium">Organization:</span>
                                    <span>{batch.createdBy.organizationName}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">Contact:</span>
                                    <span>{batch.contactPerson}</span>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4" />
                                    <span className="font-medium">Location:</span>
                                    <span>{batch.pickupLocation}</span>
                                  </div>
                                  {batch.department && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <Building className="h-4 w-4" />
                                      <span className="font-medium">Department:</span>
                                      <span>{batch.department}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span className="font-medium">Requested:</span>
                                    <span>{new Date(batch.requestDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Items: {batch.items?.length || 0}</span>
                                <span>Created: {new Date(batch.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2 ml-6">
                              <Button
                                onClick={() => handleViewBatch(batch._id)}
                                size="sm"
                                className="flex items-center space-x-1"
                              >
                                <Eye className="h-4 w-4" />
                                <span>View Details</span>
                              </Button>
                              
                              {(batch.status === 'pending' || batch.status === 'in_progress') && (
                                <Button
                                  onClick={() => navigate(`/admin/batch/${batch._id}/add-items`)}
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center space-x-1"
                                >
                                  <Plus className="h-4 w-4" />
                                  <span>{batch.status === 'pending' ? 'Add Items' : 'Add More Items'}</span>
                                </Button>
                              )}
                              
                              {batch.status === 'in_progress' && batch.items && batch.items.length > 0 && (
                                <Button
                                  onClick={() => handleCompleteBatch(batch._id, batch.batchId)}
                                  disabled={completingBatches.has(batch._id)}
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center space-x-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  {completingBatches.has(batch._id) ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                      <span>Completing...</span>
                                    </>
                                  ) : (
                                    <>
                                      <CheckSquare className="h-4 w-4" />
                                      <span>Complete</span>
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
