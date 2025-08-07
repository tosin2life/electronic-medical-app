"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Calculator } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: number;
  service_name: string;
  description: string;
  price: number;
  service_type: string;
}

interface BillingFormProps {
  appointmentId: number;
  patientId: string;
  onSuccess?: () => void;
}

export function BillingForm({
  appointmentId,
  patientId,
  onSuccess,
}: BillingFormProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<
    Array<{
      serviceId: number;
      quantity: number;
      medicationName?: string;
      dosage?: string;
      instructions?: string;
    }>
  >([]);
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const addService = () => {
    setSelectedServices([
      ...selectedServices,
      {
        serviceId: 0,
        quantity: 1,
        medicationName: "",
        dosage: "",
        instructions: "",
      },
    ]);
  };

  const removeService = (index: number) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: string, value: any) => {
    const updated = [...selectedServices];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedServices(updated);
  };

  const getSelectedService = (serviceId: number) => {
    return services.find((s) => s.id === serviceId);
  };

  const calculateSubtotal = () => {
    return selectedServices.reduce((total, item) => {
      const service = getSelectedService(item.serviceId);
      return total + (service?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      toast.error("Please add at least one service");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          patientId,
          services: selectedServices,
          discount,
          taxRate,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Billing record created successfully");
        onSuccess?.();
      } else {
        toast.error(data.message || "Failed to create billing record");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator size={20} />
            Create Bill
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Services Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Services & Medications</Label>
              <Button type="button" onClick={addService} size="sm">
                <Plus size={16} className="mr-2" />
                Add Service
              </Button>
            </div>

            {selectedServices.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Service {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Service</Label>
                    <Select
                      value={item.serviceId.toString()}
                      onValueChange={(value) =>
                        updateService(index, "serviceId", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem
                            key={service.id}
                            value={service.id.toString()}
                          >
                            {service.service_name} - ${service.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateService(
                          index,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                {/* Medication specific fields */}
                {getSelectedService(item.serviceId)?.service_type ===
                  "MEDICATION" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Medication Name</Label>
                      <Input
                        value={item.medicationName || ""}
                        onChange={(e) =>
                          updateService(index, "medicationName", e.target.value)
                        }
                        placeholder="e.g., Amoxicillin"
                      />
                    </div>
                    <div>
                      <Label>Dosage</Label>
                      <Input
                        value={item.dosage || ""}
                        onChange={(e) =>
                          updateService(index, "dosage", e.target.value)
                        }
                        placeholder="e.g., 500mg"
                      />
                    </div>
                    <div>
                      <Label>Instructions</Label>
                      <Input
                        value={item.instructions || ""}
                        onChange={(e) =>
                          updateService(index, "instructions", e.target.value)
                        }
                        placeholder="e.g., Take twice daily"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({taxRate}%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Discount Amount</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label>Tax Rate (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional billing notes..."
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating Bill..." : "Create Bill"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
