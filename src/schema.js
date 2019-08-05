'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
} = require('graphql');

const OrderType = require('./models/OrderType.js');
const PaymentType = require('./models/PaymentType.js');
const resolvers = require('./resolvers.js');

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({
    orders: {
      type: new GraphQLList(OrderType),
      resolve: () => resolvers.getOrders(),
    },
    payments: {
      type: new GraphQLList(PaymentType),
      resolve: () => resolvers.getPayments(),
    },
    orderById: {
      type: OrderType,
      args: {
        orderId: { type: GraphQLString },
      },
      resolve: (root, args) => resolvers.getOrderByOrderId(args.orderId),
    },
  }),
});

module.exports = new GraphQLSchema({
  query: QueryType,
});
