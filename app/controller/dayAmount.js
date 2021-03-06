'use strict'
const Controller = require('egg').Controller

function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class DayAmountController extends Controller {
  async index() {
    const ctx = this.ctx
    const { page = 1, pageSize = 10, startDate, endDate, dateType } = ctx.query
    const query = {
      limit: toInt(pageSize),
      offset: (toInt(page) - 1) * toInt(pageSize),
      startDate,
      endDate,
      dateType,
    }
    ctx.body = await ctx.service.dayAmount.findAll(query)
  }

  async show() {
    const ctx = this.ctx
    const id = toInt(ctx.params.id)
    ctx.body = await ctx.service.dayAmount.findById(id)
  }

  async create() {
    const ctx = this.ctx

    try {
      const rule = {
        date: 'date',
        dateType: {
          type: 'enum',
          values: ['NWD', 'TDBH', 'SH'],
        },
        lineData: {
          type: 'array',
          itemType: 'object',
          rule: {
            lineId: 'int',
            lineAmount: {
              type: 'string',
              format: /^(([1-9]\d*)|0)(\.\d{1,2})?$/,
            },
          },
        },
        sum: {
          type: 'string',
          format: /^(([1-9]\d*)|0)(\.\d{1,2})?$/,
        },
      }
      ctx.validate(rule, ctx.request.body)

    } catch (err) {
      ctx.logger.warn(err.errors)
      ctx.body = { message: '参数错误', err: err.errors }
      ctx.status = 500
      return
    }

    const res = await ctx.service.dayAmount.create(ctx.request.body)
    ctx.status = 201
    ctx.body = res
  }

  async update() {
    const ctx = this.ctx
    const id = toInt(ctx.params.id)

    const dayAmount = await ctx.service.dayAmount.findById(id)
    if (!dayAmount) {
      throw new Error('更新失败! 源数据id不存在')
    }

    ctx.body = await ctx.service.dayAmount.update({ id, previousDate: dayAmount.date }, ctx.request.body)
  }

  async destroy() {
    const ctx = this.ctx
    const id = toInt(ctx.params.id)
    const dayAmount = await ctx.service.dayAmount.findById(id)
    if (!dayAmount) {
      ctx.status = 404
      return
    }
    // 删除某一条数据,需要删除该条数据日期(date)下的所有线路数据(line_amount)
    // 删除 表 day_amount 中的数据
    await dayAmount.destroy()
    // 删除 表 line_amount 中的数据
    await ctx.service.lineAmount.deleteByDate(dayAmount.date)
    ctx.status = 200
  }
}

module.exports = DayAmountController
