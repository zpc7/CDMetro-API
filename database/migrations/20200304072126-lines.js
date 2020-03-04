'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 lines 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING } = Sequelize;
    await queryInterface.createTable('lines', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lineNo: INTEGER,
      lineColor: STRING(10),
      openDate: STRING(10),
    });
  },
  // 在执行数据库降级时调用的函数，删除 lines 表
  down: async queryInterface => {
    await queryInterface.dropTable('lines');
  },
};

