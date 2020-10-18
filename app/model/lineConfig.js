'use strict'

module.exports = app => {
  const { STRING, INTEGER, ENUM } = app.Sequelize

  const LineConfig = app.model.define('line_config', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lineNumber: STRING(3), // 线路编号
    lineColor: STRING(10), // 线路主题颜色
    lineType: ENUM('Metro', 'Tram'), // 线路类型 地铁/有轨电车
    metroFormation: STRING(3), // 车辆编组
    openDate: STRING(10), // 线路开通时间
  })

  return LineConfig
}
