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
      currentMonth: { average: '', lineAverage: [] },
      lastMonth: { average: '', lineAverage: [] },
      sameMonthLastYear: { average: '', lineAverage: [] },
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
  // 获取月度不同日期类型分析数据
  async findAnalysisDataWithDateTypeByMonth(month) {

    const response = {
      NWD: { average: '', lineAverage: [] },
      TDBH: { average: '', lineAverage: [] },
      SH: { average: '', lineAverage: [] },
    }
    response.NWD = await this.handleAverageDataByDateType('NWD', month)
    response.TDBH = await this.handleAverageDataByDateType('TDBH', month)
    response.SH = await this.handleAverageDataByDateType('SH', month)
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
  // 计算日期类型平均值
  async handleAverageDataByDateType(type, month) {
    const ctx = this.ctx
    const Op = this.app.Sequelize.Op
    const { dateRange } = calculateDateRange(month)
    const makeWhereQuery = dateType => ({ date: { [Op.between]: dateRange }, dateType })
    const result = {
      average: '',
      lineAverage: [],
    }
    const dateTypeSum = await ctx.model.LineAmount.sum('amount', { where: makeWhereQuery(type) })
    const dateTypeCount = await ctx.model.LineAmount.count({ where: makeWhereQuery(type) })
    result.average = dateTypeCount ? Number(dateTypeSum / dateTypeCount).toFixed(2) : 0

    // 获取所有线路
    const allLine = await ctx.model.LineConfig.findAll()
    // 各线路平均值
    for (const item of allLine) {
      const lineSum = await ctx.model.LineAmount.sum('amount', { where: { ...makeWhereQuery(type), lineId: item.id } })
      const lineCount = await ctx.model.LineAmount.count({ where: { ...makeWhereQuery(type), lineId: item.id } })
      if (lineCount) {
        result.lineAverage.push({
          lineId: item.id,
          average: Number(lineSum / lineCount).toFixed(2),
        })
      }
    }
    return result
  }
  // 最高纪录
  async getHighestRecord() {
    const ctx = this.ctx
    const response = {
      max: '',
      maxDate: '',
      lineMax: [],
    }
    const dayMaxInfo = await ctx.model.DayAmount.findOne({ order: [['total', 'DESC']] })
    response.max = dayMaxInfo.total
    response.maxDate = dayMaxInfo.date
    // 获取所有线路
    const allLine = await ctx.model.LineConfig.findAll()
    for (const item of allLine) {
      const lineMaxInfo = await ctx.model.LineAmount.findOne({ where: { lineId: item.id }, order: [['amount', 'DESC']] })
      response.lineMax.push({
        lineId: item.id,
        value: lineMaxInfo.amount,
        date: lineMaxInfo.date,
      })
    }
    return response
  }
}

module.exports = AnalysisService
