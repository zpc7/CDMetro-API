'use strict'
const Service = require('egg').Service

// 注意这里的model.LineConfig L 大写
class LineConfigService extends Service {
  async findAll() {
    const total = await this.ctx.model.LineConfig.count()
    const list = await this.ctx.model.LineConfig.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
    return { total, list }
  }
  async findById(id) {
    return await this.ctx.model.LineConfig.findByPk(id)
  }
  async create(requestBody) {
    const { lineColor, lineNumber, openDate, lineType, metroFormation } = requestBody

    return await this.ctx.model.LineConfig.create({
      lineColor, lineNumber, openDate, lineType, metroFormation,
    })
  }
}

module.exports = LineConfigService
