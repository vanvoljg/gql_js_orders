'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const OrderType = require('./models/OrderType.js');
const PaymentType = require('./models/PaymentType.js');

const db = require('./pg.js');

const poolQuery = async ({ query, values }) => {
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
  const query = `SELECT * FROM orders`;
  return await poolQuery({ query });
};

const getPayments = async () => {
  const query = `SELECT * FROM payments;`;
  return await poolQuery({ query });
};

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({
    orders: {
      type: new GraphQLList(OrderType),
      resolve: () => getOrders(),
    },
    payments: {
      type: new GraphQLList(PaymentType),
      resolve: () => getPayments(),
    },
  }),
});

module.exports = new GraphQLSchema({
  query: QueryType,
});
