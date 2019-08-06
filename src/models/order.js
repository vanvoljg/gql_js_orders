'use strict';

const Order = function({ id, description, total, balanceDue }) {
  const now = new Date();
  this.id =
    id ||
    'o' +
      now.getUTCFullYear() +
      now.getUTCMonth() +
      now.getUTCDate() +
      now.getUTCHours() +
      now.getUTCMinutes() +
      now.getUTCSeconds();
  this.description = description;
  this.total = total;
  this.balanceDue = balanceDue || total;
};

module.exports = Order;
