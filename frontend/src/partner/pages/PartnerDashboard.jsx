import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, MapPin, User, Building, FileText, ArrowLeft, Package, Plus, Wand2, Hash, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BatchSubmissionSuccess from '../components/BatchSubmissionSuccess';

const PartnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'batches'
  const [formData, setFormData] = useState({
    batchName: '',
    contactPerson: '',
    pickupLocation: '',
    department: '',
    requestDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBatch, setSubmittedBatch] = useState(null);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.batchName || !formData.contactPerson || !formData.pickupLocation) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Import the API service
      const { batchAPI } = await import('@/services/api');

      // Create batch data
      const batchData = {
        batchName: formData.batchName,
        contactPerson: formData.contactPerson,
        pickupLocation: formData.pickupLocation,
        department: formData.department,
        requestDate: formData.requestDate,
        notes: formData.notes
      };

      // Call the API to create the batch
      const response = await batchAPI.createBatch(batchData);

      setSubmittedBatch(response.data);
      
      toast({
        title: "Success!",
        description: `Batch request ${response.data.batchId} has been submitted successfully.`,
        variant: "default",
      });

      // Reset form
      setFormData({
        batchName: '',
        contactPerson: '',
        pickupLocation: '',
        department: '',
        requestDate: new Date().toISOString().split('T')[0],
        notes: ''
      });

    } catch (error) {
      console.error('Error creating batch:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit batch request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedBatch) {
    return (
      <BatchSubmissionSuccess
        submittedBatch={submittedBatch}
        onClose={() => setSubmittedBatch(null)}
        onCreateAnother={() => setSubmittedBatch(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header with Back to Home */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Service Partner Portal
              </h1>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('create')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'create'
                    ? 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Create/Request Service</span>
              </button>
              
              <button
                onClick={() => setActiveTab('batches')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'batches'
                    ? 'bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">My Batches</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'create' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Create New Batch Request
                </h2>
                <p className="text-lg text-gray-600">
                  Submit an e-waste pickup request for your organization
                </p>
              </div>

              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <FileText className="h-6 w-6" />
                    <span>New Batch Request</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="batchName" className="text-sm font-medium flex items-center space-x-2">
                          <Building className="h-4 w-4 text-emerald-600" />
                          <span>Batch Name *</span>
                        </Label>
                        <Input
                          id="batchName"
                          name="batchName"
                          value={formData.batchName}
                          onChange={handleInputChange}
                          placeholder="e.g., Hospital IT Equipment Disposal"
                          required
                          className="border-2 border-gray-200 focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPerson" className="text-sm font-medium flex items-center space-x-2">
                          <User className="h-4 w-4 text-emerald-600" />
                          <span>Contact Person *</span>
                        </Label>
                        <Input
                          id="contactPerson"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          placeholder="Full name of contact person"
                          required
                          className="border-2 border-gray-200 focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pickupLocation" className="text-sm font-medium flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          <span>Pickup Location *</span>
                        </Label>
                        <Input
                          id="pickupLocation"
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleInputChange}
                          placeholder="Full address for pickup"
                          required
                          className="border-2 border-gray-200 focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-sm font-medium flex items-center space-x-2">
                          <Building className="h-4 w-4 text-emerald-600" />
                          <span>Department (Optional)</span>
                        </Label>
                        <Input
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          placeholder="e.g., IT Department, Facilities"
                          className="border-2 border-gray-200 focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="requestDate" className="text-sm font-medium flex items-center space-x-2">
                          <CalendarDays className="h-4 w-4 text-emerald-600" />
                          <span>Request Date *</span>
                        </Label>
                        <Input
                          id="requestDate"
                          name="requestDate"
                          type="date"
                          value={formData.requestDate}
                          onChange={handleInputChange}
                          required
                          className="border-2 border-gray-200 focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes" className="text-sm font-medium flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-emerald-600" />
                          <span>Notes / Instructions (Optional)</span>
                        </Label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          placeholder="Any special instructions, access requirements, or additional information..."
                          rows={4}
                          className="border-2 border-gray-200 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">What happens next?</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            After submitting this request, our admin team will review your batch and add detailed item information. 
                            You'll receive a unique Batch ID for tracking your request.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            batchName: '',
                            contactPerson: '',
                            pickupLocation: '',
                            department: '',
                            requestDate: new Date().toISOString().split('T')[0],
                            notes: ''
                          });
                        }}
                      >
                        Clear Form
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 px-8"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          'Submit Batch Request'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'batches' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  My Batches
                </h2>
                <p className="text-lg text-gray-600">
                  View and manage your e-waste batch requests
                </p>
              </div>

              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <Package className="h-6 w-6" />
                    <span>Batch History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No batches found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      You haven't created any batch requests yet. Start by creating your first request.
                    </p>
                    <Button
                      onClick={() => setActiveTab('create')}
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Batch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
