'use strict';

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} = require('graphql');
const PaymentType = require('./PaymentType.js');
const resolvers = require('../resolvers.js');

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
    paymentsApplied: {
      type: new GraphQLList(PaymentType),
      resolve: (order) => resolvers.getPaymentsByOrderId(order.id),
    },
  }),
});

module.exports = OrderType;
