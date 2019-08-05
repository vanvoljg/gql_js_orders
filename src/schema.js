'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const db = require('./pg.js');

const getOrders = async () => {
  const client = await db.pool.connect();

  const query = `SELECT * FROM orders;`;

  try {
    const results = await client.query(query);
    return results.rows;
  } catch (err) {
    console.error(err);
  }
};

const getPayments = async () => {
  const client = await db.pool.connect();

  const query = `SELECT * FROM payments;`;

  try {
    const results = await client.query(query);
    return results.rows;
  } catch (err) {
    console.error(err);
  }
};

const OrderType = new GraphQLObjectType({
  name: 'Order',
  description: 'An order',

  fields: () => ({
    id: { type: GraphQLString },
    description: { type: GraphQLString },
    total: { type: GraphQLString },
    balanceDue: {
      type: GraphQLString,
      resolve: (order) => order.balance_due,
    },
  }),
});

const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  description: 'A payment',

  fields: () => ({
    id: { type: GraphQLString },
    amount: { type: GraphQLString },
    appliedAt: {
      type: GraphQLString,
      resolve: (payment) => payment.applied_at,
    },
    orderId: {
      type: GraphQLString,
      resolve: (payment) => payment.order_id,
    },
  }),
});

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
