'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 line 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    await queryInterface.createTable('line', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lineNumber: INTEGER,
      lineColor: STRING(10),
      openDate: STRING(10),
      createdAt: DATE,
      updatedAt: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 line 表
  down: async queryInterface => {
    await queryInterface.dropTable('line');
  },
};

