const jwt = require('jsonwebtoken');
const { BlacklistToken } = require('../models/index');

class TokenService {
    static async blacklistToken(token) {
        if (!token) {
            throw new Error('Token is required');
        }
        const expirationDate = new Date(jwt.decode(token).exp * 1000);
        await BlacklistToken.create({ token, expiresAt: expirationDate });
    }

    static async isTokenBlacklisted(token) {
        if (!token) {
            throw new Error('Token is required');
        }
        const blacklistedToken = await BlacklistToken.findOne({ where: { token } });
        return !!blacklistedToken;
    }
}


module.exports = TokenService;