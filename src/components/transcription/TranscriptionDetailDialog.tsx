// components/TranscriptionDetailDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const TranscriptionDetailDialog = ({ transcription, open, onClose }: any) => {
  if (!transcription) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{transcription.title}</DialogTitle>
          <DialogDescription>{transcription.date}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p>Type: {transcription.callType}</p>
          <p>Person: {transcription.name}</p>
          {/* Add more transcription details here */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptionDetailDialog;
