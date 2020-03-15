'use strict'
const Service = require('egg').Service

class DayAmountService extends Service {
  async findAll({ limit, offset, startDate, endDate, dateType }) {
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    const response = {
      total: 0,
      list: [],
    }
    // 组合 where 查询条件
    let whereQuery = {}
    if (startDate && endDate) {
      whereQuery = {
        date: {
          [Op.between]: [startDate, endDate],
        },
      }
    }
    if (dateType) {
      whereQuery = { ...whereQuery, dateType }
    }
    // 兼容analysis的访问
    // 不传limit表示给 '/analysis' 使用 (analysis需要日期从小到大排列)
    const orderType = limit ? 'DESC' : 'ASC'

    response.total = await ctx.model.DayAmount.count()
    const list = await ctx.model.DayAmount.findAll({
      limit, offset,
      where: { ...whereQuery },
      order: [['date', orderType]],
    })

    for (const item of list) {
      const dayAmountData = await ctx.service.dayAmount.getLineDataByModelDayAmount(item)
      response.list.push(dayAmountData)
    }

    return response
  }

  /**
   * 通过日期查询和组装 表 line_amount 的线路数据
  * @param {Model finaAllResponseListItem} ModelDayAmount 表day_amount中查询出来的一行
   */
  async getLineDataByModelDayAmount(ModelDayAmount) {
    const { id, date, dateType, total } = ModelDayAmount
    const lineData = await this.ctx.model.LineAmount.findAll({
      attributes: ['lineId', 'amount'],
      where: { date },
    })
    return {
      id, date, dateType, sum: total,
      lineData: lineData.map(v => ({ lineId: v.lineId, lineAmount: v.amount })),
    }
  }
  // 获取最近一天的数据
  async findLastestData() {
    const ctx = this.ctx
    const DayAmount = await ctx.model.DayAmount.findAll({ limit: 1, order: [['date', 'DESC']] })
    return await ctx.service.dayAmount.getLineDataByModelDayAmount(DayAmount[0])
  }

  async findById(id) {
    return await this.ctx.model.DayAmount.findByPk(id)
  }

  async create(requestBody) {
    const ctx = this.ctx
    const { date, dateType, lineData, sum: total } = requestBody
    // 如果新增的日期在表 day_amount 已经存在,则新增失败
    const dateCount = await ctx.model.DayAmount.count({ where: { date } })
    if (dateCount === 0) {
      // 依次新增单条线路数据
      for (const item of lineData) {
        await ctx.model.LineAmount.create({
          date, dateType, lineId: item.lineId, amount: item.lineAmount,
        })
      }
      // 更新数据(sum依靠前端的req api没有再根据数据计算)
      const newDayAmount = await ctx.model.DayAmount.create({ date, dateType, total })
      return { message: '新增成功', id: newDayAmount.id }
    }
    throw new Error(`日期 ${date} 已有值, 新增失败!`)
  }

  async update({ id, previousDate }, requestBody) {
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    const { date, dateType, sum: total, lineData } = requestBody
    // 如果更新的日期在表 day_amount 已经存在(非自身),则新增失败
    const dateCount = await ctx.model.DayAmount.count({
      where: { date, id: { [Op.ne]: id } },
    })
    if (dateCount === 0) {
      // 依次更新单条线路数据
      for (const item of lineData) {
        // 如果需要更新的位置,没有数据,则添加(发生于新增线路后编辑历史数据的情况)
        const lineInfo = await ctx.model.LineAmount.findOne({ where: { date: previousDate, lineId: item.lineId } })
        if (lineInfo) {
          await lineInfo.update({ date, dateType, amount: item.lineAmount })
        } else {
          await ctx.model.LineAmount.create({ date, dateType, lineId: item.lineId, amount: item.lineAmount })
        }
      }
      // 更新数据
      await ctx.model.DayAmount.update({ date, dateType, total }, { where: { id } })
      return { message: '更新成功!' }
    }
    throw new Error(`日期 ${date} 已有值, 更新失败!`)
  }
}

module.exports = DayAmountService
