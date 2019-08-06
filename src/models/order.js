'use strict';

const Order = function({ id, description, total, balanceDue }) {
  this.id = id;
  this.description = description;
  this.total = total;
  this.balanceDue = balanceDue || total;
};

module.exports = Order;
