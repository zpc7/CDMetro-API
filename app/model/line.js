'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Line = app.model.define('line', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lineNo: INTEGER,
    lineColor: STRING(10),
    openDate: STRING(10),
  });

  return Line;
};
