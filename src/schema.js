'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require('graphql');

const db = require('./pg.js');

const getOrders = async () => {
  const query = `SELECT * FROM orders`;

  const client = await db.pool.connect();

  try {
    const results = await client.query(query);
    if (results.rows.length === 0) return [];
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

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({
    orders: {
      type: new GraphQLList(OrderType),
      resolve: () => getOrders(),
    },
  }),
});

module.exports = new GraphQLSchema({
  query: QueryType,
});
