import sanitizeHtml from 'sanitize-html';

const expressSanitizer = (options = {}) => {
  const defaultOptions = {
    allowedTags: [],
    allowedAttributes: {},
  };
  const finalOptions = { ...defaultOptions, ...options };

  function deepSanitize(value) {
    if (typeof value !== 'object' || value === null) {
      return typeof value === 'string'
        ? sanitizeHtml(value, finalOptions)
        : value;
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? value.map(deepSanitize) : value;
    }

    const sanitizedObj = {};
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        sanitizedObj[key] = deepSanitize(value[key]);
      }
    }
    return sanitizedObj;
  }

  return async (req, res, next) => {
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
