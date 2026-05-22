import { Upload } from "lucide-react";
import type { ChangeEvent } from "react";

interface UploadDropzoneProps {
  accept?: string;
  isUploading: boolean;
  label?: string;
  name?: string;
  onUpload: (file: File) => void;
}

export function UploadDropzone({
  accept = ".docx",
  isUploading,
  label = "上传 DOCX 文档",
  name = "document",
  onUpload
}: UploadDropzoneProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  }

  return (
    <label className="upload-zone">
      <Upload size={22} />
      <span>{isUploading ? "正在处理..." : label}</span>
      <input accept={accept} disabled={isUploading} name={name} onChange={handleFileChange} type="file" />
    </label>
  );
}
