'use strict'

const Controller = require('egg').Controller

class AnalysisController extends Controller {
  async findByDateRange() {
    const ctx = this.ctx
    const { startDate, endDate } = ctx.query
    ctx.body = await ctx.service.dayAmount.findAll({ startDate, endDate })
  }
  // 获取最近一天的数据
  async findLastestData() {
    const ctx = this.ctx
    ctx.body = await ctx.service.dayAmount.findLastestData()
  }
}

module.exports = AnalysisController
