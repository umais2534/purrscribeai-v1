import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RecordingInterface from "@/components/transcription/RecordingInterface";

const TranscribePage = () => {
  return (
    <DashboardLayout>
      <RecordingInterface />
    </DashboardLayout>
  );
};

export default TranscribePage;
