import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, Check } from "lucide-react";
import { FileItem } from "./FileManager";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onUpload: (files: FileItem[]) => void;
}

export const FileUploader = ({ onUpload }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate API call with a delay
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      // Convert File objects to FileItem objects
      const newFiles: FileItem[] = selectedFiles.map((file, index) => ({
        id: Date.now().toString() + index,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date(),
        url: URL.createObjectURL(file),
      }));

      onUpload(newFiles);
      setSelectedFiles([]);
      setUploading(false);
    }, 3000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          multiple
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload size={40} className="text-muted-foreground" />
          <div>
            <h3 className="text-lg font-medium">Drag and drop files here</h3>
            <p className="text-sm text-muted-foreground">
              or{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={triggerFileInput}
              >
                browse
              </button>{" "}
              to upload
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Selected Files</h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center p-3 border rounded-md bg-background"
              >
                <File size={20} className="mr-2 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>

          {uploading ? (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <Button onClick={handleUpload} className="w-full">
              <Upload size={16} className="mr-2" />
              Upload {selectedFiles.length}{" "}
              {selectedFiles.length === 1 ? "file" : "files"}
            </Button>
          )}
        </div>
      )}

      {uploadProgress === 100 && !uploading && (
        <div className="flex items-center justify-center p-3 text-sm text-green-600 bg-green-50 rounded-md">
          <Check size={16} className="mr-2" />
          Files uploaded successfully!
        </div>
      )}
    </div>
  );
};
