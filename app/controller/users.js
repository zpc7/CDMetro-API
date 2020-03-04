'use strict';
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class UserController extends Controller {
  async index() {
    const ctx = this.ctx;
    const { page = 1, pageSize = 1 } = ctx.query;
    const query = { limit: toInt(pageSize), offset: (toInt(page) - 1) * toInt(pageSize) };
    ctx.body = await ctx.service.user.findAll(query);
  }

  async show() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    ctx.body = await ctx.service.user.findById(id);
  }

  async create() {
    const ctx = this.ctx;

    const user = await ctx.service.user.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = user;
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.service.user.findById(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    await user.update(ctx.request.body);
    ctx.body = user;
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.service.user.findById(id);
    if (!user) {
      ctx.status = 404;
      return;
    }

    await user.destroy();
    ctx.status = 200;
  }
}

module.exports = UserController;
