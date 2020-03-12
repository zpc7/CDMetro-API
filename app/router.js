'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // 日期范围内完整数据
  router.get('/analysis', controller.analysis.findByDateRange);
  router.get('/analysis/lastest', controller.analysis.findLastestData);
  // dayAmount: 某一天的完整数据,除了数据库表字段的 总运量,扩展具体的线路数据
  router.resources('dayAmount', '/dayAmount', controller.dayAmount);
  // lineAmount: 单条线路的运营数据
  router.resources('lineAmount', '/lineAmount', controller.lineAmount);
  // lineConfig: 线路基础配置
  router.resources('lineConfig', '/lineConfig', controller.lineConfig);
};
