import { LocalFileRepository } from '../../src/repositories/local-file.repository';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('LocalFileRepository', () => {
  const baseTestPath = join(__dirname, '../__tmp__');
  let repository: LocalFileRepository;

  beforeAll(async () => {
    await fs.mkdir(baseTestPath, { recursive: true });
  });

  afterAll(async () => {
    await fs.rm(baseTestPath, { recursive: true, force: true });
  });

  beforeEach(() => {
    repository = new LocalFileRepository();
    // @ts-ignore
    repository.basePath = baseTestPath;
  });

  afterEach(async () => {
    await fs.rm(baseTestPath, { recursive: true, force: true });
    await fs.mkdir(baseTestPath, { recursive: true });
  });

  describe('save', () => {
    it('should create a new index.md file with content', async () => {
      await repository.save('blog/test-post', '# Hello Test');
      const content = await fs.readFile(join(baseTestPath, 'blog', 'test-post', 'index.md'), 'utf-8');
      expect(content).toBe('# Hello Test');
    });

    it('should overwrite existing file if saving again', async () => {
      const targetPath = join(baseTestPath, 'blog', 'test-post', 'index.md');
      await repository.save('blog/test-post', '# First Version');
      await repository.save('blog/test-post', '# Overwritten Version');

      const content = await fs.readFile(targetPath, 'utf-8');
      expect(content).toBe('# Overwritten Version');
    });
  });

  describe('listPages', () => {
    it('should list paths containing index.md', async () => {
      await repository.save('about', '# About');
      await repository.save('blog/post-1', '# Blog Post');

      const pages = await repository.listPages();

      expect(pages).toContain('/about');
      expect(pages).toContain('/blog/post-1');
    });

    it('should return an empty array if no pages exist', async () => {
      const pages = await repository.listPages();

      expect(pages).toEqual([]);
    });
  });

  describe('getPageContent', () => {
    it('should return content of index.md', async () => {
      await repository.save('services/web-dev', '# Web Dev Service');

      const content = await repository.getPageContent('services/web-dev');

      expect(content).toBe('# Web Dev Service');
    });

    it('should throw if the page does not exist', async () => {
      await expect(repository.getPageContent('non-existent/page')).rejects.toThrow('Page not found.');
    });
  });
});
