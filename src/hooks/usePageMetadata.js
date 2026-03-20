import { useEffect } from "react";

export function usePageMetadata(content) {
  useEffect(() => {
    document.documentElement.lang = content.lang;
    document.title = content.metadata.title;

    const description = document.querySelector('meta[name="description"]');

    if (description) {
      description.setAttribute("content", content.metadata.description);
    }
  }, [content]);
}
