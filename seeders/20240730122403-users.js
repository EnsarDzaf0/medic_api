'use strict';

const { hashPassword } = require('../utils/password');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await hashPassword('Password123');

    const adminRole = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin';`);
    const employeeRole = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'employee';`);

    const adminRoleId = adminRole[0][0].id;
    const employeeRoleId = employeeRole[0][0].id;

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin Doe',
        username: 'adminDoe',
        password: hashedPassword,
        role_id: adminRoleId,
        last_login_date: new Date(),
        orders: 0,
        status: 'active',
        image: '',
        date_of_birth: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Admin Cook',
        username: 'adminCook',
        password: hashedPassword,
        role_id: adminRoleId,
        last_login_date: new Date(),
        orders: 0,
        status: 'active',
        image: '',
        date_of_birth: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Jane Doe',
        username: 'janeDoe',
        password: hashedPassword,
        role_id: employeeRoleId,
        last_login_date: new Date(),
        orders: 2,
        status: 'active',
        image: '',
        date_of_birth: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'John Smith',
        username: 'johnSmith',
        password: hashedPassword,
        role_id: employeeRoleId,
        last_login_date: new Date(),
        orders: 5,
        status: 'active',
        image: '',
        date_of_birth: new Date('1990-05-15'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Alice Johnson',
        username: 'aliceJohnson',
        password: hashedPassword,
        role_id: employeeRoleId,
        last_login_date: new Date(),
        orders: 3,
        status: 'active',
        image: '',
        date_of_birth: new Date('1985-09-23'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bob Brown',
        username: 'bobBrown',
        password: hashedPassword,
        role_id: employeeRoleId,
        last_login_date: new Date(),
        orders: 4,
        status: 'active',
        image: '',
        date_of_birth: new Date('1978-12-11'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Carol White',
        username: 'carolWhite',
        password: hashedPassword,
        role_id: employeeRoleId,
        last_login_date: new Date(),
        orders: 1,
        status: 'active',
        image: '',
        date_of_birth: new Date('1992-03-30'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Dave Green',
        username: 'daveGreen',
        password: hashedPassword,
        role_id: employeeRoleId,
        last_login_date: new Date(),
        orders: 7,
        status: 'active',
        image: '',
        date_of_birth: new Date('1988-07-21'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
