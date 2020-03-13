'use strict'
const Service = require('egg').Service

// 日期类型简写-全称对照表
// const enumCompareBoard = {
//   NWD: 'normal working days',
//   TDBH: 'the day before holiday',
//   SH: 'statutory holidays',
// }

class LineAmountService extends Service {
  async findAll(query) {
    const ctx = this.ctx
    const response = {
      total: 0,
      list: [],
    }
    console.log('------------')
    console.log('query', query)
    response.total = await ctx.model.LineAmount.count()
    response.list = await this.ctx.model.LineAmount.findAll()

    return response
  }
  async findById(id) {
    return await this.ctx.model.LineAmount.findByPk(id)
  }
  async create(requestBody) {
    const { date, dateType, remark, lineId, amount } = requestBody

    return await this.ctx.model.LineAmount.create({
      date, dateType, remark, lineId, amount,
    })
  }
  // 通过日期删除数据
  async deleteByDate(date) {
    await this.ctx.model.LineAmount.destroy({ where: { date } })
  }
}

module.exports = LineAmountService
