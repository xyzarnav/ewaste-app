import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Package,
  AlertTriangle,
  Leaf,
  DollarSign,
  Hash,
  Settings,
  FileText,
  Wand2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { batchAPI, autoCompleteAPI } from '@/services/api';

const BatchItemsForm = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [batch, setBatch] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCompleteOption, setShowCompleteOption] = useState(false);
  const [autoFillLoading, setAutoFillLoading] = useState({});

  // Initialize with one empty item
  useEffect(() => {
    fetchBatchDetails();
  }, [batchId]);

  const fetchBatchDetails = async () => {
    try {
      setIsLoading(true);
      const response = await batchAPI.getBatch(batchId);
      setBatch(response.data);
      
      // If batch already has items, start with one empty item for adding more
      // If batch has no items, start with one empty item
      setItems([createEmptyItem()]);
    } catch (error) {
      console.error('Error fetching batch details:', error);
      toast({
        title: "Error",
        description: "Failed to load batch details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEmptyItem = () => ({
    id: Date.now() + Math.random(),
    itemName: '',
    modelSerial: '',
    quantity: 1,
    condition: '',
    stockType: '',
    estimatedValue: '',
    co2Estimate: '',
    greenhouseGasInfo: '',
    hazardLevel: 'none',
    priority: 'medium',
    recyclingNotes: '',
    description: ''
  });

  const addItem = () => {
    setItems([...items, createEmptyItem()]);
  };

  const removeItem = (itemId) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== itemId));
    }
  };

  const updateItem = (itemId, field, value) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const handleAutoFill = async (itemId) => {
    const item = items.find(i => i.id === itemId);
    
    // Check if both itemName and modelSerial are provided
    if (!item.itemName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter an item name before using auto-fill",
        variant: "destructive",
      });
      return;
    }
    
    if (!item.modelSerial.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter a model/serial number before using auto-fill",
        variant: "destructive",
      });
      return;
    }

    setAutoFillLoading({ ...autoFillLoading, [itemId]: true });
    
    try {
      const response = await autoCompleteAPI.autoFill(item.itemName, item.modelSerial);
      
      if (response.success) {
        const autoFilledData = response.data;
        
        // Update all fields except quantity (preserve user's quantity input)
        const updatedItem = {
          ...item,
          itemName: autoFilledData.itemName || item.itemName,
          modelSerial: autoFilledData.modelSerial || item.modelSerial,
          // quantity is preserved from current item
          condition: autoFilledData.condition || item.condition,
          stockType: autoFilledData.stockType || item.stockType,
          estimatedValue: autoFilledData.estimatedValue || item.estimatedValue,
          co2Estimate: autoFilledData.co2Estimate || item.co2Estimate,
          greenhouseGasInfo: autoFilledData.greenhouseGasInfo || item.greenhouseGasInfo,
          hazardLevel: autoFilledData.hazardLevel || item.hazardLevel,
          priority: autoFilledData.priority || item.priority,
          recyclingNotes: autoFilledData.recyclingNotes || item.recyclingNotes,
          description: autoFilledData.description || item.description,
          manufacturer: autoFilledData.manufacturer || item.manufacturer
        };
        
        setItems(items.map(i => i.id === itemId ? updatedItem : i));
        
        toast({
          title: "Auto-fill Successful!",
          description: "Item details have been populated automatically",
          variant: "default",
        });
      } else {
        throw new Error(response.message || 'Auto-fill failed');
      }
    } catch (error) {
      console.error('Auto-fill error:', error);
      toast({
        title: "Auto-fill Failed",
        description: error.message || "Unable to auto-fill item details. Please fill manually.",
        variant: "destructive",
      });
    } finally {
      setAutoFillLoading({ ...autoFillLoading, [itemId]: false });
    }
  };

  const validateItems = () => {
    const errors = [];
    items.forEach((item, index) => {
      if (!item.itemName.trim()) {
        errors.push(`Item ${index + 1}: Name is required`);
      }
      if (!item.condition) {
        errors.push(`Item ${index + 1}: Condition is required`);
      }
      if (!item.stockType) {
        errors.push(`Item ${index + 1}: Stock type is required`);
      }
      if (item.quantity < 1) {
        errors.push(`Item ${index + 1}: Quantity must be at least 1`);
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateItems();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Remove temporary IDs from items
      const itemsToSave = items.map(item => {
        const { id, ...itemWithoutId } = item;
        return itemWithoutId;
      });

      // Call the API to add items to the batch
      await batchAPI.addItemsToBatch(batchId, itemsToSave);
      
      toast({
        title: "Success!",
        description: `${items.length} item${items.length !== 1 ? 's' : ''} added to batch ${batch.batchId}`,
        variant: "default",
      });
      
      // Show option to complete batch
      setShowCompleteOption(true);
    } catch (error) {
      console.error('Error saving items:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteBatch = async () => {
    try {
      await batchAPI.updateBatchStatus(batchId, 'completed');
      
      toast({
        title: "Success!",
        description: `Batch ${batch.batchId} has been marked as completed`,
        variant: "default",
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error completing batch:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to complete batch. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading batch details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Items to Batch</h1>
            <p className="text-gray-600">{batch.batchId} - {batch.batchName}</p>
          </div>
        </div>

        {/* Batch Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Batch Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Organization:</span>
                <p>{batch.createdBy.organizationName}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Contact Person:</span>
                <p>{batch.contactPerson}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Pickup Location:</span>
                <p>{batch.pickupLocation}</p>
              </div>
              {batch.department && (
                <div>
                  <span className="font-medium text-gray-600">Department:</span>
                  <p>{batch.department}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-600">Request Date:</span>
                <p>{new Date(batch.requestDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <Badge className="bg-yellow-100 text-yellow-800">Pending Items</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Item Details</span>
                </CardTitle>
                <Button
                  type="button"
                  onClick={addItem}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Information Banner */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-blue-800">
                      {batch.items && batch.items.length > 0 ? 'Adding More Items' : 'Multiple Items Support'}
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {batch.items && batch.items.length > 0 
                        ? `This batch already has ${batch.items.length} item${batch.items.length !== 1 ? 's' : ''}. You can add more items using the "Add Item" button, or remove items using the trash icon. All new items will be saved together when you submit the form.`
                        : 'You can add multiple items to this batch. Use the "Add Item" button to add more items, or remove items using the trash icon. All items will be saved together when you submit the form.'
                      }
                    </p>
                    {batch.items && batch.items.length > 0 && (
                      <div className="mt-2 p-2 bg-white rounded border">
                        <p className="text-xs text-blue-600">
                          <strong>Current batch total:</strong> {batch.items.length} item{batch.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Auto Fill Feature Banner */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Wand2 className="h-5 w-5 text-purple-500 mt-0.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-purple-800">
                      🚀 Smart Auto Fill Feature
                    </h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Save time with AI-powered auto-fill! Enter the <strong>Item Name</strong> and <strong>Model/Serial Number</strong>, 
                      then click the <strong>"Auto Fill"</strong> button to automatically populate all other fields except quantity. 
                      The system will analyze your device and provide detailed specifications, estimated values, and recycling information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
              {items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-6 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Item #{index + 1}
                    </h3>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Basic Information */}
                    <div className="space-y-2">
                      <Label htmlFor={`itemName-${item.id}`} className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span>Item Name *</span>
                      </Label>
                      <Input
                        id={`itemName-${item.id}`}
                        value={item.itemName}
                        onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                        placeholder="e.g., Dell Laptop, HP Printer"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`modelSerial-${item.id}`} className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-blue-600" />
                        <span>Model/Serial Number</span>
                      </Label>
                      <div className="flex space-x-2">
                        <Input
                          id={`modelSerial-${item.id}`}
                          value={item.modelSerial}
                          onChange={(e) => updateItem(item.id, 'modelSerial', e.target.value)}
                          placeholder="Model or serial number"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={() => handleAutoFill(item.id)}
                          disabled={autoFillLoading[item.id] || !item.itemName.trim() || !item.modelSerial.trim()}
                          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 min-w-[100px] cursor-pointer"
                          title={
                            autoFillLoading[item.id] 
                              ? "AI is filling item details..." 
                              : !item.itemName.trim() || !item.modelSerial.trim()
                                ? "Enter both Item Name and Model/Serial Number to use Auto Fill"
                                : "Click to automatically fill item details using AI"
                          }
                        >
                          {autoFillLoading[item.id] ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span className="text-xs font-medium">Filling...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="h-4 w-4" />
                              <span className="text-xs font-medium">Auto Fill</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${item.id}`} className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-blue-600" />
                        <span>Quantity *</span>
                      </Label>
                      <Input
                        id={`quantity-${item.id}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`condition-${item.id}`} className="flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-blue-600" />
                        <span>Condition *</span>
                      </Label>
                      <Select
                        value={item.condition}
                        onValueChange={(value) => updateItem(item.id, 'condition', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="working">Working</SelectItem>
                          <SelectItem value="non_working">Non-Working</SelectItem>
                          <SelectItem value="broken">Broken</SelectItem>
                          <SelectItem value="damaged">Damaged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`stockType-${item.id}`} className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span>Stock Type *</span>
                      </Label>
                      <Select
                        value={item.stockType}
                        onValueChange={(value) => updateItem(item.id, 'stockType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="electronic">Electronic</SelectItem>
                          <SelectItem value="it">IT Equipment</SelectItem>
                          <SelectItem value="battery">Battery</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="telecom">Telecom</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`estimatedValue-${item.id}`} className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>Estimated Value ($)</span>
                      </Label>
                      <Input
                        id={`estimatedValue-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.estimatedValue}
                        onChange={(e) => updateItem(item.id, 'estimatedValue', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`co2Estimate-${item.id}`} className="flex items-center space-x-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span>CO2 Estimate (kg)</span>
                      </Label>
                      <Input
                        id={`co2Estimate-${item.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.co2Estimate}
                        onChange={(e) => updateItem(item.id, 'co2Estimate', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`hazardLevel-${item.id}`} className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span>Hazard Level</span>
                      </Label>
                      <Select
                        value={item.hazardLevel}
                        onValueChange={(value) => updateItem(item.id, 'hazardLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`priority-${item.id}`} className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span>Priority</span>
                      </Label>
                      <Select
                        value={item.priority}
                        onValueChange={(value) => updateItem(item.id, 'priority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`greenhouseGasInfo-${item.id}`} className="flex items-center space-x-2">
                        <Leaf className="h-4 w-4 text-green-600" />
                        <span>Greenhouse Gas Info</span>
                      </Label>
                      <Input
                        id={`greenhouseGasInfo-${item.id}`}
                        value={item.greenhouseGasInfo}
                        onChange={(e) => updateItem(item.id, 'greenhouseGasInfo', e.target.value)}
                        placeholder="Environmental impact details"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`recyclingNotes-${item.id}`} className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span>Recycling Notes</span>
                      </Label>
                      <Input
                        id={`recyclingNotes-${item.id}`}
                        value={item.recyclingNotes}
                        onChange={(e) => updateItem(item.id, 'recyclingNotes', e.target.value)}
                        placeholder="Special recycling considerations"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor={`description-${item.id}`} className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span>Description</span>
                      </Label>
                      <Textarea
                        id={`description-${item.id}`}
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Additional details about this item..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving Items...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save {items.length} Item{items.length !== 1 ? 's' : ''}
                    </>
                  )}
                </Button>
              </div>

              {/* Complete Batch Option */}
              {showCompleteOption && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-green-800 mb-2">
                        Items Saved Successfully!
                      </h4>
                      <p className="text-green-700">
                        {items.length} item{items.length !== 1 ? 's' : ''} have been added to the batch. 
                        You can now complete the batch or add more items.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCompleteOption(false)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Add More Items
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCompleteBatch}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Complete Batch
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default BatchItemsForm;
