import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  Package, 
  DollarSign,
  Leaf,
  AlertTriangle,
  Hash,
  FileText,
  ArrowLeft,
  Wand2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { autoCompleteAPI } from '@/services/api';

const stockTypes = [
  { value: 'electronic', label: 'Electronic Equipment' },
  { value: 'it', label: 'IT Hardware' },
  { value: 'battery', label: 'Batteries' },
  { value: 'medical', label: 'Medical Equipment' },
  { value: 'telecom', label: 'Telecommunications' },
  { value: 'industrial', label: 'Industrial Equipment' }
];

const conditions = [
  { value: 'working', label: 'Working' },
  { value: 'non_working', label: 'Non-working' },
  { value: 'broken', label: 'Broken' },
  { value: 'damaged', label: 'Damaged' }
];

const priorities = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
];

const hazardLevels = [
  { value: 'none', label: 'No Hazardous Materials' },
  { value: 'low', label: 'Low Hazard' },
  { value: 'medium', label: 'Medium Hazard' },
  { value: 'high', label: 'High Hazard' }
];

export default function AdminItemForm({ batch, onSave, onCancel }) {
  const { toast } = useToast();
  const [items, setItems] = useState([createNewItem()]);
  const [loading, setLoading] = useState(false);
  const [autoFillLoading, setAutoFillLoading] = useState({});

  function createNewItem() {
    return {
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
    };
  }

  const addItem = () => {
    setItems([...items, createNewItem()]);
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
          description: autoFilledData.description || item.description
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
    for (const item of items) {
      if (!item.itemName || !item.condition || !item.stockType || !item.priority) {
        return false;
      }
      if (item.quantity < 1) {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateItems()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields for each item.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const updatedBatch = {
        ...batch,
        items: items.map(item => ({ ...item, id: undefined })), // Remove temp IDs
        status: 'in_progress',
        updatedAt: new Date().toISOString()
      };

      console.log('Saving batch with items:', updatedBatch);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Items Saved Successfully",
        description: `Added ${items.length} items to batch ${batch.batchId}`,
        variant: "default"
      });

      if (onSave) {
        onSave(updatedBatch);
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving the items. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Batches
          </Button>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Add Items to Batch: {batch.batchId}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>Company:</strong> {batch.batchName}
              </div>
              <div>
                <strong>Contact:</strong> {batch.contactPerson}
              </div>
              <div>
                <strong>Location:</strong> {batch.pickupLocation}
              </div>
            </div>
          </div>
        </div>

        {/* Items Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              E-Waste Items ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
            {items.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Item #{index + 1}
                  </h3>
                  {items.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Item Name */}
                  <div className="space-y-2">
                    <Label htmlFor={`itemName-${item.id}`} className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-600" />
                      Item Name *
                    </Label>
                    <Input
                      id={`itemName-${item.id}`}
                      value={item.itemName}
                      onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                      placeholder="e.g., Dell Monitor, HP Laptop"
                      required
                    />
                  </div>

                  {/* Model/Serial Number */}
                  <div className="space-y-2">
                    <Label htmlFor={`modelSerial-${item.id}`} className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-emerald-600" />
                      Model/Serial Number
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

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor={`quantity-${item.id}`}>Quantity *</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  {/* Condition */}
                  <div className="space-y-2">
                    <Label>Condition *</Label>
                    <Select
                      value={item.condition}
                      onValueChange={(value) => updateItem(item.id, 'condition', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((condition) => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stock Type */}
                  <div className="space-y-2">
                    <Label>Stock Type *</Label>
                    <Select
                      value={item.stockType}
                      onValueChange={(value) => updateItem(item.id, 'stockType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stock type" />
                      </SelectTrigger>
                      <SelectContent>
                        {stockTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Estimated Value */}
                  <div className="space-y-2">
                    <Label htmlFor={`estimatedValue-${item.id}`} className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      Estimated Value ($)
                    </Label>
                    <Input
                      id={`estimatedValue-${item.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.estimatedValue}
                      onChange={(e) => updateItem(item.id, 'estimatedValue', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  {/* CO2 Estimate */}
                  <div className="space-y-2">
                    <Label htmlFor={`co2Estimate-${item.id}`} className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-emerald-600" />
                      CO2 Impact (kg)
                    </Label>
                    <Input
                      id={`co2Estimate-${item.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.co2Estimate}
                      onChange={(e) => updateItem(item.id, 'co2Estimate', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  {/* Hazard Level */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-emerald-600" />
                      Hazard Level
                    </Label>
                    <Select
                      value={item.hazardLevel}
                      onValueChange={(value) => updateItem(item.id, 'hazardLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hazardLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label>Priority *</Label>
                    <Select
                      value={item.priority}
                      onValueChange={(value) => updateItem(item.id, 'priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center gap-2">
                              <Badge className={priority.color}>{priority.label}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Full-width fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Greenhouse Gas Info */}
                  <div className="space-y-2">
                    <Label htmlFor={`greenhouseGasInfo-${item.id}`}>Greenhouse Gas Information</Label>
                    <Textarea
                      id={`greenhouseGasInfo-${item.id}`}
                      value={item.greenhouseGasInfo}
                      onChange={(e) => updateItem(item.id, 'greenhouseGasInfo', e.target.value)}
                      placeholder="Environmental impact details..."
                      rows={3}
                    />
                  </div>

                  {/* Recycling Notes */}
                  <div className="space-y-2">
                    <Label htmlFor={`recyclingNotes-${item.id}`}>Recycling Notes</Label>
                    <Textarea
                      id={`recyclingNotes-${item.id}`}
                      value={item.recyclingNotes}
                      onChange={(e) => updateItem(item.id, 'recyclingNotes', e.target.value)}
                      placeholder="Special handling requirements..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 mt-4">
                  <Label htmlFor={`description-${item.id}`} className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    Description
                  </Label>
                  <Textarea
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Additional item details, condition notes, etc..."
                    rows={2}
                  />
                </div>
              </div>
            ))}

            {/* Add Item Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={addItem}
                className="flex items-center gap-2 border-dashed border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                <Plus className="h-4 w-4" />
                Add Another Item
              </Button>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Items
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

