'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Line = app.model.define('line', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lineNumber: INTEGER, // 线路编号
    lineColor: STRING(10), // 线路主题颜色
    openDate: STRING(10), // 线路开通时间
  });

  return Line;
};
