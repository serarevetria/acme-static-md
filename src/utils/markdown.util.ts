import { marked } from "marked";

// Moved to a separate utility to allow changing the
// Markdown to HTML parsing logic without impacting services.
export const markdownToHtml = async (markdown: string): Promise<string> => {
  return await marked.parse(markdown);
};
