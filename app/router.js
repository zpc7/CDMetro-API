'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.resources('lineAmount', '/lineAmount', controller.lineAmount);
  router.resources('line', '/line', controller.line);
};
