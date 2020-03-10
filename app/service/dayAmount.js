'use strict';
const Service = require('egg').Service;

class DayAmountService extends Service {
  async findAll({ limit, offset, startDate, endDate, dateType }) {
    const ctx = this.ctx;
    const Op = this.app.Sequelize.Op;
    const response = {
      total: 0,
      list: [],
    };
    // 组合查询条件
    const modelWhereQuery = { where: {} };
    if (startDate && endDate) {
      modelWhereQuery.where = {
        date: {
          [Op.between]: [startDate, endDate],
        },
      };
    }
    if (dateType) {
      modelWhereQuery.where = { ...modelWhereQuery.where, dateType };
    }

    response.total = await ctx.model.DayAmount.count();
    const list = await ctx.model.DayAmount.findAll({ limit, offset, ...modelWhereQuery, order: [['date', 'DESC']] });

    for (const item of list) {
      const lineData = await ctx.model.LineAmount.findAll({
        attributes: ['lineId', 'amount'],
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
    const ctx = this.ctx;
    const { date, dateType, lineData, sum: total } = requestBody;
    // 如果新增的日期在表 day_amount 已经存在,则新增失败
    const dateCount = await ctx.model.DayAmount.count({ where: { date } });
    if (dateCount === 0) {
      // 依次新增单条线路数据
      for (const item of lineData) {
        await ctx.model.LineAmount.create({
          date, dateType, lineId: item.lineId, amount: item.lineAmount,
        });
      }
      // 更新数据(这里的sum依靠前端的req 是否需要自己累加)
      const newDayAmount = await ctx.model.DayAmount.create({ date, dateType, total });
      return { message: '新增成功', id: newDayAmount.id };
    }
    throw new Error(`日期 ${date} 已有值, 新增失败!`);
  }
  async update(id, requestBody) {
    const ctx = this.ctx;
    const Op = this.app.Sequelize.Op;
    const { date, dateType, sum: total, lineData } = requestBody;
    // 如果更新的日期在表 day_amount 已经存在(非自身),则新增失败
    const dateCount = await ctx.model.DayAmount.count({
      where: { date, id: { [Op.ne]: id } },
    });
    if (dateCount === 0) {
      // 依次更新单条线路数据
      for (const item of lineData) {
        await ctx.model.LineAmount.update({
          date, dateType, amount: item.lineAmount,
        }, {
          where: { date, lineId: item.lineId },
        });
      }
      // 更新数据
      await ctx.model.DayAmount.update({ date, dateType, total }, { where: { id } });
      return { message: '更新成功!' };
    }
    throw new Error(`日期 ${date} 已有值, 更新失败!`);
  }
}

module.exports = DayAmountService;
