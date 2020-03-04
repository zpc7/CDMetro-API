'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, ENUM } = Sequelize;
    await queryInterface.createTable('users', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: STRING(10),
      dateType: ENUM('normal working days', 'the day before holiday', 'statutory holidays'),
      lineAmountNo1: INTEGER,
      lineAmountNo2: INTEGER,
      lineAmountNo3: INTEGER,
      remark: STRING(30),
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('users');
  },
};
