import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, MapPin, User, Building, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';



export default function PartnerBatchForm({ onBatchCreated }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    batchName: '',
    contactPerson: '',
    pickupLocation: '',
    department: '',
    requestDate: new Date().toISOString().split('T')[0], // Default to today
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.batchName || !formData.contactPerson || !formData.pickupLocation) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Prepare batch data
      const batchData = {
        batchName: formData.batchName,
        contactPerson: formData.contactPerson,
        pickupLocation: formData.pickupLocation,
        department: formData.department,
        requestDate: formData.requestDate,
        notes: formData.notes
      };

      // Import the API service
      const { batchAPI } = await import('@/services/api');

      // Call the API to create the batch
      const result = await batchAPI.createBatch(batchData);

      toast({
        title: "Batch Request Submitted!",
        description: `Your batch request has been submitted successfully. Batch ID: ${result.data.batchId}`,
        variant: "default"
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

      if (onBatchCreated) {
        onBatchCreated(result.data);
      }

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your batch request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <FileText className="h-6 w-6" />
              E-Waste Pickup Request
            </CardTitle>
            <p className="text-emerald-100 text-center mt-2">
              Submit your e-waste pickup request. An admin will add item details after submission.
            </p>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Batch Name */}
              <div className="space-y-2">
                <Label htmlFor="batchName" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building className="h-4 w-4 text-emerald-600" />
                  Company/Organization Name *
                </Label>
                <Input
                  id="batchName"
                  name="batchName"
                  value={formData.batchName}
                  onChange={handleInputChange}
                  placeholder="e.g., GE Aviation, Cincinnati Hospital"
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Request Date */}
              <div className="space-y-2">
                <Label htmlFor="requestDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  Request Date
                </Label>
                <Input
                  id="requestDate"
                  name="requestDate"
                  type="date"
                  value={formData.requestDate}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <Label htmlFor="contactPerson" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-emerald-600" />
                  Contact Person *
                </Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Full name of contact person"
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <Label htmlFor="pickupLocation" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  Pickup Location/Address *
                </Label>
                <Textarea
                  id="pickupLocation"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  placeholder="Full pickup address including building, floor, room if applicable"
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 min-h-[80px]"
                  required
                />
              </div>

              {/* Department (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building className="h-4 w-4 text-emerald-600" />
                  Department (Optional)
                </Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., IT Department, Facilities, Maintenance"
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>

              {/* Notes/Instructions */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  Notes or Special Instructions (Optional)
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions, access requirements, or additional information..."
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 min-h-[100px]"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 text-lg shadow-lg transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  'Submit Pickup Request'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-700">
                <strong>Next Steps:</strong> After submitting this request, our admin team will review your submission and add detailed item information. You'll receive a confirmation with your unique Batch ID for tracking.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
