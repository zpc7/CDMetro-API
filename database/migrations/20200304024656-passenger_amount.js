'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 passenger_amount 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, ENUM, DATE } = Sequelize;
    await queryInterface.createTable('passenger_amount', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: STRING(10),
      dateType: ENUM('NWD', 'TDBH', 'SH'),
      lineId: INTEGER,
      lineAmount: INTEGER,
      remark: STRING(30),
      createdAt: DATE,
      updatedAt: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 passenger_amount 表
  down: async queryInterface => {
    await queryInterface.dropTable('passenger_amount');
  },
};
