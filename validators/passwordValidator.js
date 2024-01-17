

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$-_%^&*]).{8,}$/;

function validatePassword(password) {
  return passwordRegex.test(password);
}

module.exports = validatePassword;
