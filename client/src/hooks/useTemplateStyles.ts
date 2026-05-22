import { useCallback, useState } from "react";
import type { ExtractedStyleLibrary } from "@word-formatter/shared";
import { extractTemplateStyles } from "../services/documentApi";

export function useTemplateStyles() {
  const [library, setLibrary] = useState<ExtractedStyleLibrary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const uploadTemplate = useCallback(async (file: File) => {
    setError(null);
    setIsExtracting(true);

    try {
      const extracted = await extractTemplateStyles(file);
      setLibrary(extracted);
    } catch (extractError) {
      setError(extractError instanceof Error ? extractError.message : "模板样式提取失败");
    } finally {
      setIsExtracting(false);
    }
  }, []);

  return {
    library,
    error,
    isExtracting,
    uploadTemplate
  };
}
