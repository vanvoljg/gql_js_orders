'use strict';

const Payment = function({ id, amount, note, orderId }) {
  this.id = id || undefined;
  this.amount = amount;
  this.appliedAt = Date.now();
  this.note = note || '';
  this.orderId = Number(orderId);
};

module.exports = Payment;
