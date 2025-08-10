import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, User, Building, CheckCircle, X } from 'lucide-react';

const BatchSubmissionSuccess = ({ submittedBatch, onClose, onCreateAnother }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="border-2 border-emerald-200 shadow-lg relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <CardHeader className="text-center bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-t-lg">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16" />
            </div>
            <CardTitle className="text-2xl">Batch Request Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                  Batch ID: {submittedBatch.batchId}
                </h3>
                <p className="text-gray-600 mb-6">
                  Your e-waste pickup request has been successfully submitted. 
                  Our admin team will review and add item details soon.
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-emerald-600" />
                  <span><strong>Batch Name:</strong> {submittedBatch.batchName}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-emerald-600" />
                  <span><strong>Contact:</strong> {submittedBatch.contactPerson}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <span><strong>Location:</strong> {submittedBatch.pickupLocation}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                  <span><strong>Request Date:</strong> {new Date(submittedBatch.requestDate).toLocaleDateString()}</span>
                </div>
                {submittedBatch.department && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-emerald-600" />
                    <span><strong>Department:</strong> {submittedBatch.department}</span>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-6">
                <Button 
                  onClick={onCreateAnother}
                  className="flex-1"
                  variant="outline"
                >
                  Create Another Request
                </Button>
                <Button 
                  onClick={() => window.print()}
                  className="flex-1"
                >
                  Print Confirmation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BatchSubmissionSuccess;
