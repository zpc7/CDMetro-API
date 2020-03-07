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
    const total = await this.ctx.model.LineAmount.count();
    const list = await this.ctx.model.LineAmount.findAll(query);
    return { total, list };
  }
  async findById(id) {
    return await this.ctx.model.LineAmount.findByPk(id);
  }
  async create(requestBody) {
    const { date, dateType, remark, lineId, amount } = requestBody;

    return await this.ctx.model.LineAmount.create({
      date, dateType, remark, lineId, amount,
    });
  }
}

module.exports = LineAmountService;
