'use strict';

const db = require('./pg.js');
const Order = require('./models/order.js');
const Payment = require('./models/payment.js');

const poolQuery = async ({ query, values }) => {
  let client;
  let results;

  try {
    client = await db.pool.connect();
    results = await client.query(query, values);
  } catch (error) {
    console.error(error);
    return ['error'];
  } finally {
    await client.release(true);
  }

  return results.rows;
};

const getOrders = async () => {
  const query = `SELECT id, description, total, balance_due
                 FROM orders`;
  return await poolQuery({ query });
};

const getOrderById = async (orderId) => {
  const query = `SELECT id, description, total, balance_due
                 FROM orders WHERE id=$1 LIMIT 1;`;
  const values = [Number(orderId)];
  return await poolQuery({ query, values });
};

const getPayments = async () => {
  const query = `SELECT id, amount, applied_at, note, order_id
                 FROM payments;`;
  return await poolQuery({ query });
};

const getPaymentsByOrderId = async (orderId) => {
  const query = `SELECT id, amount, applied_at, note, order_id
                 FROM payments WHERE order_id=$1;`;
  const values = [Number(orderId)];
  return await poolQuery({ query, values });
};

const createOrder = async (args) => {
  const newOrder = new Order(args);
  const query = `INSERT INTO orders(description, total, balance_due)
                 VALUES ($1, $2, $3)
                 RETURNING *;`;
  const { description, total, balanceDue } = newOrder;
  const values = [description, total, balanceDue];
  return await poolQuery({ query, values });
};

const reduceOrderBalance = async (args) => {
  const order = await getOrderById(args.orderId);
  const updatedOrder = new Order(order[0]);
  updatedOrder.balanceDue -= args.amount;
  const query = `UPDATE orders
                 SET id=$1, description=$2, total=$3, balance_due=$4
                 WHERE id=$1;`;
  const { id, description, total, balanceDue } = updatedOrder;
  const values = [id, description, total, balanceDue];
  await poolQuery({ query, values });
};

const applyPayment = async (args) => {
  await reduceOrderBalance(args);
  const newPayment = new Payment(args);
  const query = `INSERT INTO payments(amount, applied_at, note, order_id)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *;`;
  const { amount, appliedAt, note, orderId } = newPayment;
  const values = [amount, appliedAt, note, orderId];
  return await poolQuery({ query, values });
};

module.exports = {
  applyPayment,
  createOrder,
  getOrderById,
  getOrders,
  getPayments,
  getPaymentsByOrderId,
};
