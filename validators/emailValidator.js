

const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

function validateEmail(email) {
  return emailRegex.test(email);
}

module.exports = validateEmail;
