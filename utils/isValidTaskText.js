module.exports = function isValidTaskText(text) {
  if (typeof text !== 'string') {
    return { isValid: false, message: 'Text must be string' };
  }
  const cleanText = text.trim();

  if (!cleanText) {
    return { isValid: false, message: 'Text is required and must be a non-empty string' };
  }

  if (cleanText.length > 1000) {
    return { isValid: false, message: 'Text of todo exceeds 1000 symbols!' };
  }
  return { isValid: true };
};
