import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { type ApiError, booksService, useApiMutation } from "src/api";
import { FileDropZone } from "src/components/FileDropZone";
import { FileUploadControl } from "src/components/FileUploadControl";

export function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const mutation = useApiMutation(
    (file: File) => booksService.uploadBook(file),
    () => {
      toast.success("Book uploaded successfully!");
      navigate("/");
    },
    (error: ApiError) => {
      toast.error(`Upload failed: ${error.message}`);
    },
    ["books"],
  );

  const handleFilesSelected = (files: File[]) => {
    setSelectedFile(files[0]);
  };
  const handleClearFiles = () => {
    setSelectedFile(null);
  };
  const handleUpload = () => {
    if (selectedFile === null) {
      return;
    }
    mutation.mutate(selectedFile);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Kindle Notes</h1>
      <FileDropZone
        onFilesSelected={handleFilesSelected}
        selectedFiles={selectedFile ? [selectedFile] : []}
        acceptedTypes={["txt", "html"]}
        maxFiles={1}
        maxSizeMB={10}
      />
      <FileUploadControl
        selectedFiles={selectedFile ? [selectedFile] : []}
        onClearFiles={handleClearFiles}
        onUpload={handleUpload}
        isUploading={mutation.isPending}
      />
    </div>
  );
}
