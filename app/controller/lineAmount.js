'use strict';
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class LineAmonutController extends Controller {
  async index() {
    const ctx = this.ctx;
    const { page = 1, pageSize = 1 } = ctx.query;
    const query = { limit: toInt(pageSize), offset: (toInt(page) - 1) * toInt(pageSize) };
    ctx.body = await ctx.service.passengerAmount.findAll(query);
  }

  async show() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    ctx.body = await ctx.service.passengerAmount.findById(id);
  }

  async create() {
    const ctx = this.ctx;

    const passengerAmount = await ctx.service.passengerAmount.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = passengerAmount;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const passengerAmount = await ctx.service.passengerAmount.findById(id);
    if (!passengerAmount) {
      ctx.status = 404;
      return;
    }

    await passengerAmount.update(ctx.request.body);
    ctx.body = passengerAmount;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const passengerAmount = await ctx.service.passengerAmount.findById(id);
    if (!passengerAmount) {
      ctx.status = 404;
      return;
    }

    await passengerAmount.destroy();
    ctx.status = 200;
  }
}

module.exports = LineAmonutController;
