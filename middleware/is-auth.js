const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const headerToken = req.get('Authorization');
    if(!headerToken){
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = headerToken.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodedToken.userId;
    next()
};