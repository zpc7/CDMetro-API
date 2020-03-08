'use strict';
const Service = require('egg').Service;
const _ = require('lodash');

// 日期类型简写-全称对照表
const enumCompareBoard = {
  NWD: 'normal working days',
  TDBH: 'the day before holiday',
  SH: 'statutory holidays',
};

class LineAmountService extends Service {
  async findAll(query) {
    const ctx = this.ctx;
    const response = {
      total: 0,
      list: [],
    };
    // TODO: 处理查询参数
    console.log('------------');
    console.log('query', query);
    response.total = await ctx.model.DayAmount.count();
    const list = await this.ctx.model.LineAmount.findAll();

    list.forEach(item => {
      const key = _.findIndex(response.list, ['date', item.date]);
      if (key === -1) {
        response.list.push({
          id: item.id,
          date: item.date,
          dateType: item.dateType,
          lineData: [{
            lineId: item.lineId,
            lineAmount: item.amount,
          }],
        });
      } else {
        response.list[key].lineData.push({
          lineId: item.lineId,
          lineAmount: item.amount,
        });
      }
    });
    return response;
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
