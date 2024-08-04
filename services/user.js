const { User, Role } = require('../models/index');
const { hashPassword, comparePasswords } = require('../utils/password');
const jwt = require('jsonwebtoken');
const tokenExpiration = process.env.JWT_Token_Expiration || '30min';
const { loginSchema, updateUserSchema, registerUserSchema } = require('../validations/user');

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

    static async getAllUsers() {
        let users = User.findAll({
            attributes: ['id', 'name', 'username', 'lastLoginDate'],
            include: {
                model: Role,
                attributes: ['name'],
                as: 'role'
            },
            order: [['updatedAt', 'DESC']]
        });
        return users;
    }

    static async getUserById(id) {
        return User.findByPk(id, {
            attributes: ['id', 'name', 'username', 'orders', 'lastLoginDate', 'image', 'status', 'dateOfBirth'],
            include: {
                model: Role,
                attributes: ['name'],
                as: 'role'
            }
        });
    }

    static async updateUser(id, data) {
        const { error } = updateUserSchema.validate(data);
        if (error) {
            throw new Error(error.message);
        }
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return User.update(data, {
            where: {
                id
            }
        });
    }

    static async registerUser(userData, file) {
        const { error } = registerUserSchema.validate(userData);
        if (error) {
            throw new Error(error.message);
        }
        const user = await this.getUserByUsername(userData.username);
        if (user) {
            throw new Error('Username already exists');
        }
        const role = await this.getRoleByName(userData.role);
        if (!role) {
            throw new Error('Role not found');
        }
        const hashedPassword = await hashPassword(userData.password);
        return User.create({
            ...userData,
            roleId: role.id,
            password: hashedPassword,
            image: file ? file.location : null
        });
    }

    static async getRoleByName(name) {
        return Role.findOne({
            where: {
                name
            }
        });
    }
}

module.exports = UserService;