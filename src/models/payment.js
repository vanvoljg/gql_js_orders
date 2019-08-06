'use strict';

const Payment = function({ id, amount, note, orderId }) {
  const now = new Date();
  this.id =
    id ||
    'p' +
      now.getUTCFullYear() +
      now.getUTCMonth() +
      now.getUTCDate() +
      now.getUTCHours() +
      now.getUTCMinutes() +
      now.getUTCSeconds();
  this.amount = Math.round(amount);
  this.appliedAt = new Date().toUTCString();
  this.note = note || '';
  this.orderId = orderId;
};

module.exports = Payment;
