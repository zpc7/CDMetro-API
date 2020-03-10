'use strict';
const Service = require('egg').Service;
const _ = require('lodash');

class DayAmountService extends Service {
  async findAll(query) {
    const ctx = this.ctx;
    const response = {
      total: 0,
      list: [],
    };

    response.total = await ctx.model.DayAmount.count();
    const list = await ctx.model.DayAmount.findAll({ ...query, order: [[ 'date', 'DESC' ]] });

    for (const item of list) {
      const lineData = await ctx.model.LineAmount.findAll({
        attributes: [ 'lineId', 'amount' ],
        where: { date: item.date },
      });
      response.list.push({
        id: item.id,
        date: item.date,
        dateType: item.dateType,
        lineData: lineData.map(v => ({ lineId: v.lineId, lineAmount: v.amount })),
        sum: item.total,
      });
    }

    return response;
  }
  async findById(id) {
    return await this.ctx.model.DayAmount.findByPk(id);
  }
  async create(requestBody) {
    const { date, dateType, lineData, sum } = requestBody;
    // 如果新增的日期已经存在,则新增失败
    const dateCount = await this.ctx.model.LineAmount.count({ where: { date } });
    if (dateCount === 0) {
      // 依次更新单条线路数据
      for (const item of lineData) {
        await this.ctx.model.LineAmount.create({
          date, dateType, lineId: item.lineId, amount: item.lineAmount,
        });
      }
      // 更新总数
      // TODO:这里的sum依靠前端的req 是否需要自己累加
      const newDayAmount = await this.ctx.model.DayAmount.create({
        date, dateType, total: sum,
      });
      return { message: '新增成功', id: newDayAmount.id };
    }
    throw new Error('新增失败!');
  }
}

module.exports = DayAmountService;
