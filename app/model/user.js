'use strict';

module.exports = app => {
  const { STRING, INTEGER, ENUM } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    date: STRING(10),
    dateType: ENUM('normal working days', 'the day before holiday', 'statutory holidays'),
    lineAmountNo1: INTEGER,
    lineAmountNo2: INTEGER,
    lineAmountNo3: INTEGER,
    remark: STRING(30),
  });

  return User;
};
