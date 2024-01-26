const jwt = require('jsonwebtoken');




const createAdminJWT = (payload) => {
    const admintoken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return admintoken
};


module.exports = {
    createAdminJWT
}