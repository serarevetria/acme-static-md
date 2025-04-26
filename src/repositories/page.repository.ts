export interface PageRepository {
  save(path: string, content: string): Promise<void>;
  listPages(): Promise<string[]>;
  getPageContent(path: string): Promise<string>;
}
