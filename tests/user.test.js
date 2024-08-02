const expect = require('chai').expect;
const sinon = require('sinon');
const { User } = require('../models/index');
const UserService = require('../services/user');
const passwordUtils = require('../utils/password');
const jwt = require('jsonwebtoken');

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

    describe('Get All Users', () => {
        let findAll;

        const mockUsers = [
            {
                id: 1,
                name: 'John Doe',
                username: 'johnDoe',
                lastLoginDate: new Date(),
                role: {
                    name: 'admin'
                }
            },
            {
                id: 2,
                name: 'Jane Smith',
                username: 'janeSmith',
                lastLoginDate: new Date(),
                role: {
                    name: 'user'
                }
            }
        ];

        beforeEach(() => {
            findAll = sinon.stub(User, 'findAll');
        });

        afterEach(() => {
            findAll.restore();
        });

        it('should return all users with their roles', async () => {
            findAll.resolves(mockUsers);

            const result = await UserService.getAllUsers();

            expect(result).to.be.equal(mockUsers);
        });

        it('should return an empty array if no users are found', async () => {
            findAll.resolves([]);

            const result = await UserService.getAllUsers();

            expect(result).to.be.an('array').that.is.empty;
        });
    });

    describe('Get User By ID', () => {
        let findByPk;

        const mockUser = {
            id: 1,
            name: 'John Doe',
            username: 'johnDoe',
            orders: 2,
            lastLoginDate: new Date(),
            image: '',
            status: 'active',
            dateOfBirth: new Date(),
            role: {
                name: 'admin'
            }
        };

        beforeEach(() => {
            findByPk = sinon.stub(User, 'findByPk');
        });

        afterEach(() => {
            findByPk.restore();
        });

        it('should return user with provided ID', async () => {
            findByPk.resolves(mockUser);

            const result = await UserService.getUserById(1);

            expect(result).to.deep.equal(mockUser);
        });

        it('should return null if user is not found', async () => {
            findByPk.resolves(null);

            const result = await UserService.getUserById(0);

            expect(result).to.be.null;
        });
    });

    describe('Update User', () => {
        let update;
        let findUserStub;

        const userData = {
            name: 'Updated John Doe',
            username: 'updatedJohnDoe',
            orders: 3,
            status: 'inactive',
            dateOfBirth: new Date()
        };

        beforeEach(() => {
            update = sinon.stub(User, 'update');
            findUserStub = sinon.stub(UserService, 'getUserById');
        });

        afterEach(() => {
            update.restore();
            findUserStub.restore();
        });

        it('should update user data with provided ID', async () => {
            update.resolves([1]);
            findUserStub.resolves({
                id: 1,
                name: 'John Doe',
                username: 'johnDoe',
                orders: 2,
                lastLoginDate: new Date(),
                image: '',
                status: 'active',
                dateOfBirth: new Date(),
                role: {
                    name: 'admin'
                }
            });

            const result = await UserService.updateUser(1, userData);

            expect(result).to.deep.equal([1]);
        });

        it('should throw an error if user is not found', async () => {
            update.resolves([0]);
            findUserStub.resolves(null);

            try {
                await UserService.updateUser(0, userData);
            } catch (error) {
                expect(error.message).to.be.equal('User not found');
            }
        });
    });
});