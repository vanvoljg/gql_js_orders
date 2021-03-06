'use strict';

const Order = require('./models/order.js');
const Payment = require('./models/payment.js');
const { Pool } = require('pg').native;

const config = {
  connectionString: process.env.DATABASE_URL,
  max: process.env.DATABASE_MAX_CONNECTIONS || 10,
  idleTimeoutMillis: process.env.DATABASE_IDLE_TIMEOUT_MILLIS || 10000,
  connectionTimeoutMillis: process.env.DATABASE_CONNECTION_TIMEOUT_MILLIS || 0,
};

const db = new Pool(config);

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
    client = await db.connect();
    result = await client.query(query, values);
  } catch (error) {
    console.error(error);
    result.rows = Promise.resolve([]);
  } finally {
    // Always release the pool connection, even if there is an error.
    client.release(true);
  }

  return result.rows;
};

/**
 * getOrders queries the database for all orders.
 * @returns {Promise<Array>} A promise which resolves to an array of orders.
 */
const getOrders = async () => {
  const query = `SELECT id, description, total, balance_due
                 FROM orders;`;

  return await poolQuery(query);
};

/**
 * getOrderById queries the database for a specific order.
 * @param {number} orderId - The ID of the order to search for.
 * @returns {Promise<Array>} A promise which resolves to an array containing the
 * found order, or an empty array if no order is found.
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
 * @param {number} orderId - The ID of the order to find payments for.
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
 * reduceOrderBalance takes in an order and payment information and reduces the
 * balance due of the referenced order.
 * @param {Object} order - An order query result from SQL
 * @param {number} amount - The amount by which to reduce the order total
 * @returns {Object} The order with its balance reduced by the amount provided
 */
const reduceOrderBalance = (order, amount) => {
  // Updating the balance: avoid rounding errors by working in integers
  // Could also be avoided by storing numbers as strings, converting to
  // numbers for math, then back to strings for storage and display.
  const updatedOrder = new Order(order);
  updatedOrder.balanceDue =
    (Math.round(updatedOrder.balanceDue * 100) - Math.round(amount * 100)) /
    100;

  return updatedOrder;
};

/**
 * applyPayment takes in payment information and reduces the referenced order's balance
 * before saving the payment information to the database.
 * The transaction is atomic. It either fully inserts payment and updates the order
 * or rolls back.
 * @param {Object} args - An object containing payment information.
 * @param {number} args.amount - The payment amount.
 * @param {number} args.orderId - The orderId to apply the payment to.
 * @param {string} [args.note] - A note to attach to the payment.
 * @returns {Promise<Array>} A promise which resolves to an array containing the
 * newly created payment, or an empty array if there was an error.
 */
const applyPayment = async (args) => {
  // Get the order in question and translate the snake_case column to camelCase
  const order = await getOrderById(args.orderId);
  order[0].balanceDue = order[0].balance_due;

  const updatedOrder = reduceOrderBalance(order[0], args.amount);

  const newPayment = new Payment(args);

  const client = await db.connect();
  let result;

  try {
    await client.query('BEGIN');

    const { amount, appliedAt, note, orderId } = newPayment;
    const paymentValues = [amount, appliedAt, note, orderId];
    const paymentQuery = `INSERT INTO payments(amount, applied_at, note, order_id)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *;`;

    result = await client.query(paymentQuery, paymentValues);

    const orderUpdateQuery = `UPDATE orders
                 SET id=$1, description=$2, total=$3, balance_due=$4
                 WHERE id=$1
                 RETURNING *;`;
    const { id, description, total, balanceDue } = updatedOrder;
    const orderUpdateValues = [id, description, total, balanceDue];

    await client.query(orderUpdateQuery, orderUpdateValues);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    result.rows = Promise.resolve([]);
  } finally {
    client.release(true);
  }

  return result.rows;
};

module.exports = {
  applyPayment,
  createOrder,
  getOrderById,
  getOrders,
  getPaymentsByOrderId,
};
