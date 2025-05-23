import { dirname, join, normalize } from "path";
import { promises as fs } from "fs";
import { PageRepository } from "./page.repository";

export class LocalFileRepository implements PageRepository {
  private basePath: string;

  constructor() {
    this.basePath = process.env.CONTENT_DIR
      ? join(process.cwd(), process.env.CONTENT_DIR)
      : join(__dirname, '..', 'content');
    this.ensureContentFolderExists()
  }

  private async ensureContentFolderExists() {
    try {
      await fs.mkdir(this.basePath, { recursive: true });
    } catch (error) {
      console.error('[LocalFileRepository] Failed to create content folder:', error);
      throw error;
    }
  }

  async save(path: string, content: string): Promise<void> {
    const normalizedPath = normalize(path);

    const targetDir = join(this.basePath, normalizedPath);
    const targetFile = join(targetDir, "index.md");

    await fs.mkdir(dirname(targetFile), { recursive: true });

    await fs.writeFile(targetFile, content, "utf-8");
  }

  async listPages(): Promise<string[]> {
    const paths: string[] = [];

    async function traverse(currentPath: string, relativePath = "") {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const newRelativePath = relativePath
            ? `${relativePath}/${entry.name}`
            : entry.name;
          await traverse(join(currentPath, entry.name), newRelativePath);
        } else if (entry.isFile() && entry.name === "index.md") {
          paths.push(`/${relativePath}`);
        }
      }
    }

    await traverse(this.basePath);
    paths.sort();
    return paths;
  }

  async getPageContent(path: string): Promise<string> {
    const normalizedPath = normalize(path);
    const targetFile = join(this.basePath, normalizedPath, "index.md");

    try {
      const content = await fs.readFile(targetFile, "utf-8");
      return content;
    } catch {
      throw new Error("Page not found.");
    }
  }
}
