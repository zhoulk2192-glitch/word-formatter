import { useCallback, useState } from "react";
import type { UploadedDocument } from "@word-formatter/shared";
import { parseDocument } from "../services/documentApi";

export function useDocumentUpload() {
  const [document, setDocument] = useState<UploadedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadDocument = useCallback(async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const parsed = await parseDocument(file);
      setDocument(parsed);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "文档解析失败");
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    document,
    error,
    isUploading,
    uploadDocument
  };
}
