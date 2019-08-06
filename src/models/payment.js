'use strict';

const Payment = function({ id, amount, note, orderId }) {
  this.id = id;
  // We want to round the amount to the nearest cent
  // * 100 -> Round fractional part -> / 100 -> Rounded dollars w/ cents
  this.amount = Math.round(amount * 100) / 100;
  this.appliedAt = new Date().toUTCString();
  this.note = note || '';
  this.orderId = orderId;
};

module.exports = Payment;
