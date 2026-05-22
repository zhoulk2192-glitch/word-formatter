import { Upload } from "lucide-react";
import type { ChangeEvent } from "react";

interface UploadDropzoneProps {
  isUploading: boolean;
  onUpload: (file: File) => void;
}

export function UploadDropzone({ isUploading, onUpload }: UploadDropzoneProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  }

  return (
    <label className="upload-zone">
      <Upload size={22} />
      <span>{isUploading ? "正在解析..." : "上传 DOCX 文档"}</span>
      <input accept=".docx" disabled={isUploading} onChange={handleFileChange} type="file" />
    </label>
  );
}
