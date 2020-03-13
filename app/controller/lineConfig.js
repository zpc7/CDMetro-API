'use strict'
const Controller = require('egg').Controller

function toInt(str) {
  if (typeof str === 'number') return str
  if (!str) return str
  return parseInt(str, 10) || 0
}

class LineConfigController extends Controller {
  async index() {
    const ctx = this.ctx
    ctx.body = await ctx.service.lineConfig.findAll()
  }

  async show() {
    const ctx = this.ctx
    const id = toInt(ctx.params.id)
    ctx.body = await ctx.service.lineConfig.findById(id)
  }

  async create() {
    const ctx = this.ctx

    const lineConfig = await ctx.service.lineConfig.create(ctx.request.body)
    ctx.status = 201
    ctx.body = lineConfig
  }

  async update() {
    const ctx = this.ctx
    const id = toInt(ctx.params.id)
    const lineConfig = await ctx.service.lineConfig.findById(id)
    if (!lineConfig) {
      ctx.status = 404
      return
    }

    await lineConfig.update(ctx.request.body)
    ctx.body = lineConfig
  }

  async destroy() {
    const ctx = this.ctx
    const id = toInt(ctx.params.id)
    const lineConfig = await ctx.service.lineConfig.findById(id)
    if (!lineConfig) {
      ctx.status = 404
      return
    }

    await lineConfig.destroy()
    ctx.status = 200
  }
}

module.exports = LineConfigController
