const expect = require('chai').expect;
const sinon = require('sinon');
const { BlacklistToken } = require('../models/index');
const TokenService = require('../services/token');
const jwt = require('jsonwebtoken');

describe('Token Service', () => {
    describe('Blacklist Token', () => {
        let createStub;
        let jwtStub;

        beforeEach(() => {
            createStub = sinon.stub(BlacklistToken, 'create');
            jwtStub = sinon.stub(jwt, 'decode');
        });

        afterEach(() => {
            createStub.restore();
            jwtStub.restore();
        });

        it('should create a new blacklisted token', async () => {
            const token = 'token';
            const expirationTime = Math.floor(Date.now() / 1000) + 3600;
            const expectedExpirationDate = new Date(expirationTime * 1000);

            jwtStub.returns({ exp: expirationTime });
            createStub.resolves({ token, expiresAt: expectedExpirationDate });

            await TokenService.blacklistToken(token);

            expect(createStub.calledOnceWith({ token, expiresAt: expectedExpirationDate })).to.be.true;
            expect(jwtStub.calledOnce).to.be.true;
        });

        it('should throw an error if token is not provided', async () => {
            try {
                await TokenService.blacklistToken();
            } catch (error) {
                expect(error.message).to.be.equal('Token is required');
            }
        });
    });
    describe('Is Token Blacklisted', () => {
        let findOneStub;

        beforeEach(() => {
            findOneStub = sinon.stub(BlacklistToken, 'findOne');
        });

        afterEach(() => {
            findOneStub.restore();
        });

        it('should return true if token is blacklisted', async () => {
            const token = 'token';
            findOneStub.resolves({ token });

            const result = await TokenService.isTokenBlacklisted(token);

            expect(result).to.be.true;
            expect(findOneStub.calledOnceWith({ where: { token } })).to.be.true;
        });

        it('should return false if token is not blacklisted', async () => {
            const token = 'token';
            findOneStub.resolves(null);

            const result = await TokenService.isTokenBlacklisted(token);

            expect(result).to.be.false;
            expect(findOneStub.calledOnceWith({ where: { token } })).to.be.true;
        });

        it('should throw an error if token is not provided', async () => {
            try {
                await TokenService.isTokenBlacklisted();
            } catch (error) {
                expect(error.message).to.be.equal('Token is required');
            }
        });
    });
});