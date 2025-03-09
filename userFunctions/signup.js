// helper functions

// Validates email using a regular expression
function isValidEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Validates password strength
function isValidPassword(password) {
  // Minimum length of 8 characters, at least one uppercase, one number, and one special character
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return passwordPattern.test(password);
}

module.exports = { isValidEmail, isValidPassword }