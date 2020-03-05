'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.get('/', controller.home.index);
  router.resources('passengerAmount', '/passengerAmount', controller.passengerAmount);
  router.resources('line', '/line', controller.line);
};
