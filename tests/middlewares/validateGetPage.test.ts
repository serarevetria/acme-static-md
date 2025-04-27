import { validateGetPage } from '../../src/middleware/validateGetPage';
import { GetPageSchema } from '../../src/validations/page.validation';

describe('validateGetPage middleware', () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should call next() if path param is valid', () => {
    req.params.path = 'blog/test';

    validateGetPage(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if path param is missing', () => {
    validateGetPage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation Error',
    }));
  });

  it('should handle unexpected errors', () => {
    const req = {
      params: { path: 'blog/test' }
    } as any;
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
  
    const next = jest.fn();
  
    const originalParse = GetPageSchema.parse;
    GetPageSchema.parse = jest.fn(() => { throw new Error('Unexpected error'); });
  
    validateGetPage(req, res, next);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Validation Error',
      details: 'Unexpected error',
    }));
  
    GetPageSchema.parse = originalParse;
  });
  
});
