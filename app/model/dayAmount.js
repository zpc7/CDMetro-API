'use strict'

module.exports = app => {
  const { STRING, INTEGER, ENUM, DECIMAL } = app.Sequelize

  const DayAmount = app.model.define('day_amount', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: STRING(10), // 数据日期
    dateType: ENUM('NWD', 'TDBH', 'SH'), // 日期类型(普通工作日 假期前一天 法定节假日)
    total: DECIMAL(10, 2).UNSIGNED, // 当天所有数据总和
  })

  return DayAmount
}
