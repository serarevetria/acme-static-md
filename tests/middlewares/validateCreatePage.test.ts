import { validateCreatePage } from '../../src/middleware/validateCreatePage';
import { CreatePageSchema } from '../../src/validations/page.validation';

describe('validateCreatePage middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
      file: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next() if body and file are valid', () => {
    req.body.path = 'blog/test';
    req.file = { originalname: 'index.md', mimetype: 'text/markdown', buffer: Buffer.from('') };

    validateCreatePage(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if path is missing', () => {
    req.file = { originalname: 'index.md', mimetype: 'text/markdown', buffer: Buffer.from('') };

    validateCreatePage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation Error',
    }));
  });

  it('should return 400 if file is missing', () => {
    req.body.path = 'blog/test';

    validateCreatePage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation Error',
    }));
  });

  it('should handle unexpected errors', () => {
    const req = {
      body: { path: 'blog/test' },
      file: { originalname: 'index.md', mimetype: 'text/markdown', buffer: Buffer.from('') }
    } as any;
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
  
    const next = jest.fn();
  
    const originalParse = CreatePageSchema.parse;
    CreatePageSchema.parse = jest.fn(() => { throw new Error('Unexpected error'); });
  
    validateCreatePage(req, res, next);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation Error',
      details: 'Unexpected error',
    }));
  
    CreatePageSchema.parse = originalParse;
  });
  
});
