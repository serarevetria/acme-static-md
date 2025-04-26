import { RepositoryFactory } from "../repositories/repository.factory";
import { CreatePageInput, PageContent, PageList } from "../types/page.types";
import { markdownToHtml } from "../utils/markdown.util";

export class PageService {
  private pageRepository;

  constructor() {
    this.pageRepository = RepositoryFactory.createPageRepository();
  }

  async createPage({ path, content }: CreatePageInput): Promise<void> {
    await this.pageRepository.save(path, content);
  }

  async getAllPages(): Promise<PageList> {
    const pages = await this.pageRepository.listPages();
    return pages;
  }

  async getPage(path: string): Promise<PageContent> {
    const markdownContent = await this.pageRepository.getPageContent(path);
    const htmlContent = markdownToHtml(markdownContent);
    return htmlContent;
  }
}
