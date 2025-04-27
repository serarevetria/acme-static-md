import request from 'supertest';
import { app } from '../../src/server';
import { promises as fs } from 'fs';
import { join } from 'path';

describe('Page End-to-End Tests', () => {
  const testPath = 'test-page';
  const testContent = '# Hello World from Test';
  const updatedContent = '# Updated Content';
  const contentDir = join(process.cwd(), process.env.CONTENT_DIR!, testPath);

  beforeAll(async () => {
    await fs.mkdir(join(process.cwd(), process.env.CONTENT_DIR!), { recursive: true });
  });  

  afterAll(async () => {
    await fs.rm(join(process.cwd(), process.env.CONTENT_DIR!), { recursive: true, force: true });
  });

  it('should create a new markdown file', async () => {
    const response = await request(app)
      .post('/api/pages')
      .field('path', testPath)
      .attach('file', Buffer.from(testContent), {
        filename: 'index.md',
        contentType: 'text/markdown',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Page created successfully.' });

    const fileExists = await fs.readFile(join(contentDir, 'index.md'), 'utf-8');
    expect(fileExists).toContain('Hello World from Test');
  });

  it('should overwrite an existing markdown file', async () => {
    const response = await request(app)
      .post('/api/pages')
      .field('path', testPath)
      .attach('file', Buffer.from(updatedContent), {
        filename: 'index.md',
        contentType: 'text/markdown',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Page created successfully.' });

    const fileContent = await fs.readFile(join(contentDir, 'index.md'), 'utf-8');
    expect(fileContent).toContain('Updated Content');
  });

  it('should retrieve the page as HTML', async () => {
    const response = await request(app)
      .get(`/api/pages/${testPath}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('content');
    expect(response.body.content).toContain('<h1>Updated Content</h1>');
  });

  it('should return 404 when requesting a non-existing page', async () => {
    const response = await request(app)
      .get('/api/pages/non-existing-page');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Page not found.' });
  });
});
