const { User, Role } = require('../models/index');
const { hashPassword, comparePasswords } = require('../utils/password');
const jwt = require('jsonwebtoken');
const tokenExpiration = process.env.JWT_Token_Expiration || '30min';
const crypto = require('crypto');
const { loginSchema } = require('../validations/user');

class UserService {
    static async getUserByUsername(username) {
        return User.findOne({
            where: {
                username
            },
            include: {
                model: Role,
                attributes: ['name'],
                as: 'role'
            }
        });
    }

    static async loginUser(userData) {
        const { error } = loginSchema.validate(userData);
        if (error) {
            throw new Error(error.message);
        }

        const user = await this.getUserByUsername(userData.username);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (user.role.name == 'employee') {
            throw new Error('Access denied');
        }

        const isPasswordValid = await comparePasswords(userData.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: tokenExpiration });
        return { user, token };
    }
}

module.exports = UserService;