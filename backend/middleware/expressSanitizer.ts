import sanitizeHtml from 'sanitize-html';
import { Request, Response, NextFunction } from 'express';

type Value = string | object | Array<string | object | Value[]> | null;

const Options: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
};
function deepSanitize(value: Value): Value {
  if (typeof value !== 'object' || value === null) {
    return typeof value === 'string' ? sanitizeHtml(value, Options) : value;
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.map(deepSanitize) : value;
  }

  const sanitizedObj: { [key: string]: Value } = {};
  const objectValue = value as Record<string, Value>;
  for (const [key, val] of Object.entries(objectValue)) {
    sanitizedObj[key] = deepSanitize(val);
  }
  return sanitizedObj;
}

const expressSanitizer = (req: Request, res: Response, next: NextFunction) => {
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

export default expressSanitizer;
