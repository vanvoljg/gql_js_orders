'use strict';

const Order = function({ id, description, total, balanceDue }) {
  this.id = id;
  this.description = description;
  this.total = total;
  this.balanceDue = balanceDue || this.total;
};

module.exports = Order;
