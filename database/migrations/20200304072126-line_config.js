'use strict'

module.exports = {
  // 在执行数据库升级时调用的函数，创建 line_config 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM } = Sequelize
    await queryInterface.createTable('line_config', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lineNumber: STRING(3),
      lineColor: STRING(10),
      lineType: {
        type: ENUM('Metro', 'Tram'), // 地铁/有轨电车,
        defaultValue: 'Metro',
      },
      metroFormation: STRING(3), // 车辆编组
      openDate: STRING(10),
      createdAt: DATE,
      updatedAt: DATE,
    })
  },
  // 在执行数据库降级时调用的函数，删除 line_config 表
  down: async queryInterface => {
    await queryInterface.dropTable('line_config')
  },
}

