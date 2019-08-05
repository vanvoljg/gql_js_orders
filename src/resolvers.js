'use strict';

const db = require('./pg.js');

const poolQuery = async ({ query, values }) => {
  console.log('QUERY:', { query }, { values });
  let client;

  try {
    client = await db.pool.connect();
    const results = await client.query(query, values);
    return results.rows;
  } catch (error) {
    console.error(error);
  } finally {
    await client.release(true);
  }
};

const getOrders = async () => {
  const query = `SELECT id, description, total, balance_due
                 FROM orders`;
  return await poolQuery({ query });
};

const getOrderByOrderId = async (orderId) => {
  const query = `SELECT id, description, total, balance_due
                 FROM orders WHERE id=$1 LIMIT 1;`;
  const values = [Number(orderId)];
  const orderResults = await poolQuery({ query, values });
  return orderResults[0];
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
  console.log({ query }, { values });
  return await poolQuery({ query, values });
};

module.exports = {
  getOrderByOrderId,
  getOrders,
  getPayments,
  getPaymentsByOrderId,
};
