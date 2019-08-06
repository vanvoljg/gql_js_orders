'use strict';

const db = require('./pg.js');
const Order = require('./models/order.js');
const Payment = require('./models/payment.js');

/**
 * poolQuery uses the connection pool from pg to make queries to the database.
 * Errors are handled by returning an empty array.
 * @param {string} query - The SQL query string.
 * @param {Array} [values] - The array of values to correspond.
 * @returns {Promise<Array>} A promise which resolves to the query result array.
 */
const poolQuery = async (query, values = []) => {
  let client;
  let result;

  try {
    client = await db.pool.connect();
    result = await client.query(query, values);
  } catch (error) {
    console.error(error);
    result.rows = Promise.resolve([]);
  } finally {
    await client.release(true);
  }

  return result.rows;
};

/**
 * getOrders queries the database for all orders.
 * @returns {Promise<Array>} A promise which resolves to an array of orders.
 */
const getOrders = async () => {
  const query = `SELECT id, description, total, balance_due
                 FROM orders`;
  return await poolQuery(query);
};

/**
 * getOrderById queries the database for a specific order.
 * @param {number} orderId - The ID of the order to search for.
 * @returns {Promise<Array>} A promise which resolves to an array containing the
 * found order, or an empty array of no order is found.
 */
const getOrderById = async (orderId) => {
  const query = `SELECT id, description, total, balance_due
                 FROM orders WHERE id=$1 LIMIT 1;`;
  const values = [Number(orderId)];
  return await poolQuery(query, values);
};

/**
 * getPaymentsByOrderId queries the database for payments made on an order specified
 * by ID.
 * @param {OrderId} orderId - The ID of the order to find payments for.
 * @returns {Promise<Array>} A promise which resolves to an array of payments made
 * on the specified order, or an empty array if no payments are found.
 */
const getPaymentsByOrderId = async (orderId) => {
  const query = `SELECT id, amount, applied_at, note, order_id
                 FROM payments WHERE order_id=$1;`;
  const values = [Number(orderId)];
  return await poolQuery(query, values);
};

/**
 * createOrder creates an order based on input from the createOrder mutation.
 * @param {Object} args - An object containing order information.
 * @param {string} args.description - A description of the order.
 * @param {number} args.total - The total of the order.
 * @param {number} [args.balanceDue] - The remaining balance due on the order.
 * @returns {Promise<Array>} A promise which resolves to an array containing the
 * created order, or an empty array if there was a database error on insert.
 */
const createOrder = async (args) => {
  const newOrder = new Order(args);
  const query = `INSERT INTO orders(description, total, balance_due)
                 VALUES ($1, $2, $3)
                 RETURNING *;`;
  const { description, total, balanceDue } = newOrder;
  const values = [description, total, balanceDue];
  return await poolQuery(query, values);
};

/**
 * reduceOrderBalance takes in payment information and reduces the balance due
 * of the referenced order.
 * @param {Object} args - An object containing payment information.
 * @param {OrderId} args.orderId - An orderId to apply a payment to.
 * @param {number} args.amount - The amount to reduce the balance by.
 */
const reduceOrderBalance = async (args) => {
  const order = await getOrderById(args.orderId);
  const updatedOrder = new Order(order[0]);
  console.log({ args }, { updatedOrder });
  updatedOrder.balanceDue -= args.amount;
  const query = `UPDATE orders
                 SET id=$1, description=$2, total=$3, balance_due=$4
                 WHERE id=$1
                 RETURNING *;`;
  const { id, description, total, balanceDue } = updatedOrder;
  const values = [id, description, total, balanceDue];
  await poolQuery(query, values);
};

/**
 * applyPayment takes in payment information and reduces the referenced order's balance
 * before saving the payment information to the database.
 * @param {Object} args - An object containing payment information.
 * @param {number} args.amount - The payment amount.
 * @param {OrderId} args.orderId - The orderId to apply the payment to.
 * @param {string} [args.note] - A note to attach to the payment.
 * @returns {Promise<Array>} A promise which resolves to an array containing the
 * newly created payment, or an empty array if there was an error.
 */
const applyPayment = async (args) => {
  await reduceOrderBalance(args);
  const newPayment = new Payment(args);
  const query = `INSERT INTO payments(amount, applied_at, note, order_id)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *;`;
  const { amount, appliedAt, note, orderId } = newPayment;
  const values = [amount, appliedAt, note, orderId];
  return await poolQuery(query, values);
};

module.exports = {
  applyPayment,
  createOrder,
  getOrderById,
  getOrders,
  getPaymentsByOrderId,
};
