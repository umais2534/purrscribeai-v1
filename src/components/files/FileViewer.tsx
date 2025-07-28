import React from "react";
import { FileItem } from "./FileManager";

interface FileViewerProps {
  file: FileItem;
}

export const FileViewer = ({ file }: FileViewerProps) => {
  // Determine how to render the file based on its type
  const renderFileContent = () => {
    if (file.type.includes("pdf")) {
      return (
        <div className="p-4 text-center">
          <p className="mb-4">PDF preview is currently unavailable.</p>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Download to view
          </a>
        </div>
      );
    } else if (
      file.type.includes("image") ||
      file.url.endsWith(".jpg") ||
      file.url.endsWith(".jpeg") ||
      file.url.endsWith(".png")
    ) {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={file.url}
            alt={file.name}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      );
    } else if (
      file.type.includes("word") ||
      file.type.includes("doc") ||
      file.url.endsWith(".doc") ||
      file.url.endsWith(".docx")
    ) {
      return (
        <div className="p-4 text-center">
          <p className="mb-4">Word documents cannot be previewed directly.</p>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Download to view
          </a>
        </div>
      );
    } else if (
      file.type.includes("sheet") ||
      file.type.includes("excel") ||
      file.url.endsWith(".xls") ||
      file.url.endsWith(".xlsx")
    ) {
      return (
        <div className="p-4 text-center">
          <p className="mb-4">Spreadsheets cannot be previewed directly.</p>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Download to view
          </a>
        </div>
      );
    } else {
      return (
        <div className="p-4 text-center">
          <p className="mb-4">This file type cannot be previewed.</p>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Download to view
          </a>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-md overflow-hidden">
      {renderFileContent()}
    </div>
  );
};
