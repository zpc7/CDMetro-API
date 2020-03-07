'use strict';
const Service = require('egg').Service;

// 日期类型简写-全称对照表
const enumCompareBoard = {
  NWD: 'normal working days',
  TDBH: 'the day before holiday',
  SH: 'statutory holidays',
};

class LineAmountService extends Service {
  async findAll(query) {
    const total = await this.ctx.model.PassengerAmount.count();
    const list = await this.ctx.model.PassengerAmount.findAll(query);
    return { total, list };
  }
  async findById(id) {
    return await this.ctx.model.PassengerAmount.findByPk(id);
  }
  async create(requestBody) {
    const { date, dateType, remark, lineId, lineAmount } = requestBody;

    return await this.ctx.model.PassengerAmount.create({
      date, dateType, remark, lineId, lineAmount,
    });
  }
}

module.exports = LineAmountService;
