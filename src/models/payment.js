'use strict';

const Payment = function({ id, amount, note, orderId }) {
  this.id = id;
  this.amount = amount;
  this.appliedAt = new Date().toUTCString();
  this.note = note || '';
  this.orderId = orderId;
};

module.exports = Payment;
