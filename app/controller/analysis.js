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
  // 获取月度分析数据
  async findByMonth() {
    const ctx = this.ctx
    const { month } = ctx.params
    try {
      ctx.body = await ctx.service.analysis.findAnalysisDataByMonth(month)
    } catch (err) {
      ctx.body = { message: '月份暂无数据' }
      ctx.status = 500
      return
    }
  }
}

module.exports = AnalysisController
