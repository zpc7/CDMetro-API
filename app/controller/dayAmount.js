'use strict';
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class DayAmountController extends Controller {
  async index() {
    const ctx = this.ctx;
    const { page = 1, pageSize = 1 } = ctx.query;
    const query = { limit: toInt(pageSize), offset: (toInt(page) - 1) * toInt(pageSize) };
    ctx.body = await ctx.service.dayAmount.findAll(query);
  }

  async show() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    ctx.body = await ctx.service.dayAmount.findById(id);
  }

  async create() {
    const ctx = this.ctx;

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
      };
      ctx.validate(rule, ctx.request.body);

    } catch (err) {
      ctx.logger.warn(err.errors);
      ctx.body = { message: '参数错误', err: err.errors };
      ctx.status = 500;
      return;
    }

    const res = await ctx.service.dayAmount.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = res;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const dayAmount = await ctx.service.dayAmount.findById(id);
    if (!dayAmount) {
      ctx.status = 404;
      return;
    }

    await dayAmount.update(ctx.request.body);
    ctx.body = dayAmount;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const dayAmount = await ctx.service.dayAmount.findById(id);
    if (!dayAmount) {
      ctx.status = 404;
      return;
    }

    await dayAmount.destroy();
    ctx.status = 200;
  }
}

module.exports = DayAmountController;
