'use strict';

const Payment = function({ id, amount, note, orderId }) {
  this.id = id || undefined;
  this.amount = Math.round(amount);
  this.appliedAt = new Date().toUTCString();
  this.note = note || '';
  this.orderId = orderId;
};

module.exports = Payment;
