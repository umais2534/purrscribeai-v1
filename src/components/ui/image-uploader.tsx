import React, { useState, useRef, ChangeEvent } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SUPPORTED_IMAGE_FORMATS, MAX_UPLOAD_SIZE } from "@/config/apiConfig";
import { uploadFile } from "@/services/apiService";

interface ImageUploaderProps {
  imageUrl?: string;
  onImageChange: (url: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  className?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function ImageUploader({
  imageUrl = "",
  onImageChange,
  onImageUpload,
  className,
  label = "Image",
  placeholder = "Enter image URL or upload an image",
  disabled = false,
}: ImageUploaderProps) {
  const [url, setUrl] = useState<string>(imageUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [preview, setPreview] = useState<string>(imageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setPreview(newUrl);
    onImageChange(newUrl);
    setError("");
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
      setError(
        `Unsupported file format. Please use: ${SUPPORTED_IMAGE_FORMATS.join(", ")}.`,
      );
      return;
    }

    // Validate file size
    if (file.size > MAX_UPLOAD_SIZE) {
      setError(
        `File too large. Maximum size is ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB.`,
      );
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      // Create a local preview
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      // Upload the file
      let uploadedUrl;
      if (onImageUpload) {
        uploadedUrl = await onImageUpload(file);
      } else {
        const result = await uploadFile(file);
        uploadedUrl = result.url;
      }

      // Update the URL field and notify parent
      setUrl(uploadedUrl);
      onImageChange(uploadedUrl);

      // Clean up the local preview
      URL.revokeObjectURL(localPreview);
      setPreview(uploadedUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image");
      // Keep the local preview if upload fails
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setPreview("");
    onImageChange("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="image-url">{label}</Label>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="image-url"
              type="text"
              placeholder={placeholder}
              value={url}
              onChange={handleUrlChange}
              disabled={disabled || isUploading}
              className="pr-8"
            />
            {url && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={disabled || isUploading}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleFileSelect}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={SUPPORTED_IMAGE_FORMATS.join(",")}
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {preview && (
          <div className="relative mt-2 rounded-md border border-border overflow-hidden">
            <div className="aspect-video relative bg-muted flex items-center justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
                onError={() => {
                  setError("Failed to load image preview");
                }}
              />
              {!preview && (
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
