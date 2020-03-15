'use strict'
const Controller = require('egg').Controller

function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class LineAmountController extends Controller {
  async index() {
    const ctx = this.ctx
    const { page = 1, pageSize = 10 } = ctx.query
    const query = { limit: toInt(pageSize), offset: (toInt(page) - 1) * toInt(pageSize) }
    ctx.body = await ctx.service.lineAmount.findAll(query)
  }

  async show() {
    const ctx = this.ctx
    const id = toInt(ctx.params.id)
    ctx.body = await ctx.service.lineAmount.findById(id)
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
        amount: {
          type: 'string',
          format: /^(([1-9]\d*)|0)(\.\d{1,2})?$/,
        },
        lineId: {
          type: 'int',
        },
      }
      // 如果不传第二个参数会自动校验 `ctx.request.body`
      ctx.validate(rule, ctx.request.body)
    } catch (err) {
      ctx.logger.warn(err.errors)
      ctx.body = { message: '参数错误', err: err.errors }
      ctx.status = 500
      return
    }

    const lineAmount = await ctx.service.lineAmount.create(ctx.request.body)
    ctx.status = 201
    ctx.body = lineAmount
  }

  async update() {
    const ctx = this.ctx
    const id = toInt(ctx.params.id)
    const lineAmount = await ctx.service.lineAmount.findById(id)
    if (!lineAmount) {
      ctx.status = 404
      return
    }

    await lineAmount.update(ctx.request.body)
    ctx.body = lineAmount
  }

  async destroy() {
    const ctx = this.ctx
    const id = toInt(ctx.params.id)
    const lineAmount = await ctx.service.lineAmount.findById(id)
    if (!lineAmount) {
      ctx.status = 404
      return
    }

    await lineAmount.destroy()
    ctx.status = 200
  }
}

module.exports = LineAmountController
