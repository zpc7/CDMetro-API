'use strict';
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class LineController extends Controller {
  async index() {
    const ctx = this.ctx;
    ctx.body = await ctx.service.line.findAll();
  }

  async show() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    ctx.body = await ctx.service.line.findById(id);
  }

  async create() {
    const ctx = this.ctx;

    const line = await ctx.service.line.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = line;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const line = await ctx.service.line.findById(id);
    if (!line) {
      ctx.status = 404;
      return;
    }

    await line.update(ctx.request.body);
    ctx.body = line;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const line = await ctx.service.line.findById(id);
    if (!line) {
      ctx.status = 404;
      return;
    }

    await line.destroy();
    ctx.status = 200;
  }
}

module.exports = LineController;
