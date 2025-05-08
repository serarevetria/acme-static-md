import { PageService } from '../../src/services/page.service';
import { PageRepository } from '../../src/repositories/page.repository';
import { CreatePageInput } from '../../src/types/page.types';

const mockRepository = {
  save: jest.fn(),
  listPages: jest.fn(),
  getPageContent: jest.fn(),
};

const typedMockRepository = mockRepository as unknown as PageRepository;

describe('PageService', () => {
  let pageService: PageService;

  beforeEach(() => {
    jest.clearAllMocks();
    pageService = new PageService();
    // @ts-ignore
    pageService.pageRepository = typedMockRepository;
  });

  describe('createPage', () => {
    it('should save the page using the repository', async () => {
      const input: CreatePageInput = { path: 'blog/test-post', content: '# Hello' };

      await pageService.createPage(input);

      expect(mockRepository.save).toHaveBeenCalledWith(input.path, input.content);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should throw error if the repository.save fails', async () => {
      mockRepository.save.mockRejectedValueOnce(new Error('Save error'));
      const input: CreatePageInput = { path: 'blog/error-post', content: '# Error' };

      await expect(pageService.createPage(input)).rejects.toThrow('Save eerror');
    });
  });

  describe('getAllPages', () => {
    it('should return a list of pages', async () => {
      const fakePages = ['/about', '/blog/post-1'];
      mockRepository.listPages.mockResolvedValueOnce(fakePages);

      const result = await pageService.getAllPages();

      expect(result).toEqual(fakePages);
    });

    it('should return an empty array if no pages', async () => {
      mockRepository.listPages.mockResolvedValueOnce([]);

      const result = await pageService.getAllPages();

      expect(result).toEqual([]);
    });

    it('should throw error if repository.listPages fails', async () => {
      mockRepository.listPages.mockRejectedValueOnce(new Error('List error'));

      await expect(pageService.getAllPages()).rejects.toThrow('List error');
    });
  });

  describe('getPage', () => {
    it('should return HTML converted from markdown', async () => {
      const markdown = '# Hello World';
      mockRepository.getPageContent.mockResolvedValueOnce(markdown);

      const result = await pageService.getPage('blog/test');

      expect(result).toContain('<h1>');
      expect(result).toContain('Hello World');
    });

    it('should throw if page does not exist', async () => {
      mockRepository.getPageContent.mockRejectedValueOnce(new Error('Page not found'));

      await expect(pageService.getPage('non-existent')).rejects.toThrow('Page not found');
    });

    it('should not return raw markdown', async () => {
      const markdown = '# Raw markdown';
      mockRepository.getPageContent.mockResolvedValueOnce(markdown);

      const result = await pageService.getPage('blog/raw');

      expect(result).not.toContain('# Raw markdown');
      expect(result).toContain('<h1>');
    });
  });
});
