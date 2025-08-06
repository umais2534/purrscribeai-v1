import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "./FileUploader";
import { FileList } from "./FileList";

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  url: string;
}

const FileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Patient Report.pdf",
      type: "application/pdf",
      size: 2500000,
      uploadDate: new Date(2023, 5, 15),
      url: "#",
    },
    {
      id: "2",
      name: "Treatment Plan.docx",
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      size: 1500000,
      uploadDate: new Date(2023, 6, 20),
      url: "#",
    },
    {
      id: "3",
      name: "Lab Results.pdf",
      type: "application/pdf",
      size: 3200000,
      uploadDate: new Date(2023, 7, 5),
      url: "#",
    },
  ]);

  const handleFileUpload = (newFiles: FileItem[]) => {
    setFiles((prevFiles) => [...newFiles, ...prevFiles]);
  };

  const handleFileDelete = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">File Management</h1>

      <Tabs defaultValue="upload" className="w-full">
  {/* Background container for the tabs */}
 <div className="p-4 border rounded-lg mb-8 w-full max-w-md mx-auto">
  <TabsList className="flex flex-col sm:grid sm:grid-cols-2 gap-2 w-full">
    <TabsTrigger value="upload" className="w-full bg-gray-400 text-white">
      Upload Files
    </TabsTrigger>
    <TabsTrigger value="manage" className="w-full bg-gray-400 text-white">
      Manage Files
    </TabsTrigger>
  </TabsList>
</div>


  <TabsContent value="upload" className="p-4 border rounded-lg">
    <FileUploader onUpload={handleFileUpload} />
  </TabsContent>

  <TabsContent value="manage" className="p-4 border rounded-lg ">
    <FileList files={files} onDelete={handleFileDelete} />
  </TabsContent>
</Tabs>

    </div>
  );
};

export default FileManager;
