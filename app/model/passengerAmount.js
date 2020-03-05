'use strict';

module.exports = app => {
  const { STRING, INTEGER, ENUM } = app.Sequelize;

  const PassengerAmount = app.model.define('passenger_amount', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date: STRING(10), // 数据日期
    dateType: ENUM('NWD', 'TDBH', 'SH'), // 日期类型(普通工作日 假期前一天 法定节假日)
    lineId: INTEGER, // 线路Id(注意不是线路编号)
    lineAmount: INTEGER, // 线路客运量
    remark: STRING(30), // 备注
  });

  return PassengerAmount;
};
