const expect = require('chai').expect;
const sinon = require('sinon');
const { User, Role } = require('../models/index');
const UserService = require('../services/user');
const passwordUtils = require('../utils/password');
const jwt = require('jsonwebtoken');
const { loginSchema } = require('../validations/user');

describe('User Service', () => {
    describe('Get User By Username', () => {
        let findOne;

        beforeEach(() => {
            findOne = sinon.stub(User, 'findOne');
        });

        afterEach(() => {
            findOne.restore();
        });

        it('should return user with provided username', async () => {
            const mockUser = {
                id: 1,
                name: 'John Doe',
                username: 'johnDoe',
                role: {
                    name: 'admin'
                }
            };

            findOne.resolves(mockUser);

            const result = await UserService.getUserByUsername('johnDoe');

            expect(result).to.be.equal(mockUser);
            expect(findOne.calledOnce).to.be.true;
        });

        it('should return null if user is not found', async () => {
            findOne.resolves(null);

            const result = await UserService.getUserByUsername('empty');

            expect(result).to.be.null;
            expect(findOne.calledOnce).to.be.true;
        });
    });

    describe('Login User', () => {
        let findOne;
        let sign;
        let comparePasswordsStub;

        const mockUser = {
            id: 1,
            name: 'John Doe',
            username: 'johnDoe',
            password: process.env.HASHED_PASSWORD,
            role: {
                name: 'admin'
            }
        };

        const userData = {
            username: 'johnDoe',
            password: 'Password123'
        };

        beforeEach(() => {
            findOne = sinon.stub(UserService, 'getUserByUsername');
            sign = sinon.stub(jwt, 'sign');
            comparePasswordsStub = sinon.stub(passwordUtils, 'comparePasswords');
        });

        afterEach(() => {
            findOne.restore();
            sign.restore();
            comparePasswordsStub.restore();
        });

        it('should throw an error if validation fails', async () => {
            sinon.stub(loginSchema, 'validate').returns({ error: new Error('Validation error') });
            try {
                await UserService.loginUser({
                    username: 'johnDoe',
                    password: 'Password123'
                });
            } catch (error) {
                expect(error.message).to.be.equal('Validation error');
            }

            loginSchema.validate.restore();
        });

        it('should throw an error if user is not found', async () => {
            findOne.resolves(null);

            try {
                await UserService.loginUser(userData);
            } catch (error) {
                expect(error.message).to.be.equal('Invalid credentials');
            }
        });

        it('should return user and token if credentials are valid', async () => {
            findOne.resolves(mockUser);
            sign.returns('token');
            comparePasswordsStub.returns(true);

            const result = await UserService.loginUser(userData);

            expect(result).to.deep.equal({ user: mockUser, token: 'token' });
        });

        it('should throw an error if credentials are invalid', async () => {
            findOne.resolves(null);

            try {
                await UserService.loginUser(userData);
            } catch (error) {
                expect(error.message).to.be.equal('Invalid credentials');
            }
        });

        it('should throw an error if password is invalid', async () => {
            findOne.resolves(mockUser);
            comparePasswordsStub.resolves(false);

            try {
                await UserService.loginUser({
                    username: 'johnDoe',
                    password: 'password000'
                });
            } catch (error) {
                expect(error.message).to.be.equal('Invalid credentials');
            }
        });

        it('should throw an error if user role is employee', async () => {
            const mockUser = {
                id: 1,
                name: 'John Doe',
                username: 'johnDoe',
                password: 'Password123',
                role: {
                    name: 'employee'
                }
            };

            findOne.resolves(mockUser);

            try {
                await UserService.loginUser(userData);
            } catch (error) {
                expect(error.message).to.be.equal('Access denied');
            }
        });
    });
});