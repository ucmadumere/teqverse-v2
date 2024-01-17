const bcrypt = require('bcrypt');

async function verifyPassword(userPassword, inputPassword) {
    try {
        return await bcrypt.compare(inputPassword, userPassword);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = verifyPassword;