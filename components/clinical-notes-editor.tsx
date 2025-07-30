"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, History, Save, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ClinicalNotesVersion {
  id: number;
  notes: string;
  version_number: number;
  change_reason?: string;
  is_current: boolean;
  created_at: string;
  doctor_name: string;
  doctor_specialization: string;
}

interface ClinicalNotesEditorProps {
  medicalRecordId: number;
  initialNotes?: string;
  onSave?: (notes: string) => void;
  canEdit?: boolean;
}

export function ClinicalNotesEditor({
  medicalRecordId,
  initialNotes = "",
  onSave,
  canEdit = false,
}: ClinicalNotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [changeReason, setChangeReason] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [versions, setVersions] = useState<ClinicalNotesVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchVersions();
  }, [medicalRecordId]);

  useEffect(() => {
    setHasChanges(notes !== initialNotes);
  }, [notes, initialNotes]);

  const fetchVersions = async () => {
    try {
      const response = await fetch(
        `/api/medical-records/${medicalRecordId}/clinical-notes`
      );
      if (response.ok) {
        const data = await response.json();
        setVersions(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    }
  };

  const handleSave = async () => {
    if (!canEdit) {
      toast.error("Only doctors can edit clinical notes");
      return;
    }

    if (!notes.trim()) {
      toast.error("Notes cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/medical-records/${medicalRecordId}/clinical-notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes: notes.trim(),
            change_reason: changeReason.trim() || undefined,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success("Clinical notes updated successfully");
        setIsEditing(false);
        setChangeReason("");
        setHasChanges(false);
        onSave?.(notes);
        fetchVersions();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update notes");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNotes(initialNotes);
    setChangeReason("");
    setIsEditing(false);
    setHasChanges(false);
  };

  const currentVersion = versions.find((v) => v.is_current);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Clinical Notes</h3>
          {currentVersion && (
            <Badge variant="secondary">
              Version {currentVersion.version_number}
            </Badge>
          )}
          {!canEdit && (
            <Badge variant="outline" className="text-gray-600">
              View Only
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showHistory} onOpenChange={setShowHistory}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Clinical Notes History</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {versions.map((version) => (
                    <Card
                      key={version.id}
                      className={
                        version.is_current ? "ring-2 ring-blue-500" : ""
                      }
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">
                              Version {version.version_number}
                            </CardTitle>
                            {version.is_current && (
                              <Badge variant="default">Current</Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {format(
                              new Date(version.created_at),
                              "MMM dd, yyyy 'at' HH:mm"
                            )}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Doctor:</span>{" "}
                          {version.doctor_name} ({version.doctor_specialization}
                          )
                        </div>
                        {version.change_reason && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">
                              Reason for change:
                            </span>{" "}
                            {version.change_reason}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">
                            {version.notes}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {canEdit && !isEditing ? (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Notes
            </Button>
          ) : canEdit && isEditing ? (
            <div className="flex items-center gap-2">
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Clinical Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter clinical notes..."
              className="min-h-[200px] mt-2"
            />
          </div>

          <div>
            <Label htmlFor="changeReason">Reason for Change (Optional)</Label>
            <Input
              id="changeReason"
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="e.g., Patient condition update, new symptoms observed..."
              className="mt-2"
            />
          </div>

          {hasChanges && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">
                You have unsaved changes. Click "Save Changes" to create a new
                version.
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          {notes ? (
            <p className="whitespace-pre-wrap text-gray-700">{notes}</p>
          ) : (
            <p className="text-gray-500 italic">No clinical notes available</p>
          )}
          {!canEdit && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Only doctors can edit clinical notes. You
                can view the history of all changes by clicking the "History"
                button above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
