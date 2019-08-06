'use strict';

const {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const PaymentType = require('./PaymentType.js');
const resolvers = require('../pgResolvers.js');

const OrderType = new GraphQLObjectType({
  name: 'Order',
  description: 'An order',

  fields: {
    id: { type: GraphQLNonNull(GraphQLID) },
    description: { type: GraphQLNonNull(GraphQLString) },
    total: { type: GraphQLNonNull(GraphQLString) },
    balanceDue: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (order) => order.balance_due,
    },
    paymentsApplied: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(PaymentType))),
      resolve: (order) => resolvers.getPaymentsByOrderId(order.id),
    },
  },
});

module.exports = OrderType;
