import sanitizeHtml from 'sanitize-html';

const expressSanitizer = (options = {}) => {
  const defaultOptions = {
    allowedTags: [],
    allowedAttributes: {},
  };
  const finalOptions = { ...defaultOptions, ...options };
  function deepSanitize(value) {
    if (typeof value === 'string') {
      return sanitizeHtml(value, finalOptions);
    } else if (Array.isArray(value)) {
      return value.map(deepSanitize);
    } else if (value !== null && typeof value === 'object') {
      const sanitizedObj = {};
      for (const key in value) {
        sanitizedObj[key] = deepSanitize(value[key]);
      }
      return sanitizedObj;
    }
    return value;
  }

  return async (req, res, next) => {
    try {
      if (req.body) {
        req.body = deepSanitize(req.body);
      }
      if (req.query) {
        const sanitizedQuery = deepSanitize(req.query);
        Object.keys(sanitizedQuery).forEach((key) => {
          req.query[key] = sanitizedQuery[key];
        });
      }
      next();
    } catch (error) {
      throw error;
    }
  };
};

export default expressSanitizer;
