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
          sum: '',
        });
      } else {
        response.list[key].lineData.push({
          lineId: item.lineId,
          lineAmount: item.amount,
        });
      }
    });
    const totalFromTableDayAmount = await ctx.model.DayAmount.findAll({ attributes: ['date', 'total'] });
    totalFromTableDayAmount.forEach(item => {
      const singleListIndex = _.findIndex(response.list, o => o.date === item.date);
      if (singleListIndex !== -1) {
        response.list[singleListIndex].sum = item.total;
      }
    });
    return response;
  }
  async findById(id) {
    return await this.ctx.model.LineAmount.findByPk(id);
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
