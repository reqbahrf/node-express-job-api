import sanitizeHtml from 'sanitize-html';
import { Request, Response, NextFunction } from 'express';

type value = string | object | Array<any> | null;

const expressSanitizer = (options = {}) => {
  const defaultOptions = {
    allowedTags: [],
    allowedAttributes: {},
  };
  const finalOptions = { ...defaultOptions, ...options };

  function deepSanitize(value: value): value {
    if (typeof value !== 'object' || value === null) {
      return typeof value === 'string'
        ? sanitizeHtml(value, finalOptions)
        : value;
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? value.map(deepSanitize) : value;
    }

    const sanitizedObj: { [key: string]: value } = {};
    const objectValue = value as Record<string, any>;
    for (const key in objectValue) {
      if (objectValue.hasOwnProperty(key)) {
        sanitizedObj[key] = deepSanitize(objectValue[key]);
      }
    }
    return sanitizedObj;
  }

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body && Object.keys(req.body).length > 0) {
        req.body = deepSanitize(req.body);
      }
      if (req.query && Object.keys(req.query).length > 0) {
        const sanitizedQuery = deepSanitize(req.query);
        Object.assign(req.query, sanitizedQuery);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default expressSanitizer;
