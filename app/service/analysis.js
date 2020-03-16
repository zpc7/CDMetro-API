'use strict'
const Service = require('egg').Service
const moment = require('moment')
const calculateDateRange = month => {
  const earlyMonth = moment(month).startOf('month')
  const endOfTheMonth = moment(month).endOf('month')
  const startDate = earlyMonth.format('YYYY-MM-DD')
  const endDate = endOfTheMonth.format('YYYY-MM-DD')
  const lastMonthStartDate = earlyMonth.subtract(1, 'month').format('YYYY-MM-DD')
  const lastMonthEndDate = endOfTheMonth.subtract(1, 'month').format('YYYY-MM-DD')
  const sameMonthLastYearStartDate = earlyMonth.subtract(1, 'year').format('YYYY-MM-DD')
  const sameMonthLastYearEndDate = endOfTheMonth.subtract(1, 'year').format('YYYY-MM-DD')
  return {
    dateRange: [startDate, endDate],
    lastMonthDateRange: [lastMonthStartDate, lastMonthEndDate],
    sameMonthLastYearDateRange: [sameMonthLastYearStartDate, sameMonthLastYearEndDate],
  }
}

class AnalysisService extends Service {
  // 获取月度分析数据
  async findAnalysisDataByMonth(month) {
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    const makeWhereQuery = dateRange => ({ date: { [Op.between]: dateRange } })
    const { dateRange, lastMonthDateRange, sameMonthLastYearDateRange } = calculateDateRange(month)

    const response = {
      max: {},
      min: {},
      currentMonth: {
        average: '',
        lineAverage: [],
      },
      lastMonth: {
        average: '',
        lineAverage: [],
      },
      sameMonthLastYear: {
        average: '',
        lineAverage: [],
      },
    }
    // max min
    const maxData = await ctx.model.DayAmount.findOne({ where: makeWhereQuery(dateRange), order: [['total', 'DESC']] })
    const minData = await ctx.model.DayAmount.findOne({ where: makeWhereQuery(dateRange), order: [['total', 'ASC']] })
    response.max = {
      date: maxData.date,
      value: maxData.total,
    }
    response.min = {
      date: minData.date,
      value: minData.total,
    }
    response.currentMonth = await this.handleAverageData(dateRange)
    response.lastMonth = await this.handleAverageData(lastMonthDateRange)
    response.sameMonthLastYear = await this.handleAverageData(sameMonthLastYearDateRange)

    return response
  }
  // 计算平均值
  async handleAverageData(dateRange) {
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    const makeWhereQuery = dateRange => ({ date: { [Op.between]: dateRange } })
    const result = {
      average: '',
      lineAverage: [],
    }
    // 总平均值
    const monthSum = await ctx.model.DayAmount.sum('total', { where: makeWhereQuery(dateRange) })
    const monthCount = await ctx.model.DayAmount.count({ where: makeWhereQuery(dateRange) })
    result.average = monthCount ? Number(monthSum / monthCount).toFixed(2) : 0
    // 获取所有线路
    const allLine = await ctx.model.LineConfig.findAll()
    // 各线路平均值
    for (const item of allLine) {
      const lineSum = await ctx.model.LineAmount.sum('amount', { where: { ...makeWhereQuery(dateRange), lineId: item.id } })
      const lineCount = await ctx.model.LineAmount.count({ where: { ...makeWhereQuery(dateRange), lineId: item.id } })
      if (lineCount) {
        result.lineAverage.push({
          lineId: item.id,
          average: Number(lineSum / lineCount).toFixed(2),
        })
      }
    }
    return result
  }
}

module.exports = AnalysisService
