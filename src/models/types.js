'use strict';

const {
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql');

const resolvers = require('../pgResolvers.js');

const OrderType = new GraphQLObjectType({
  name: 'Order',
  description: 'An order',

  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    description: { type: GraphQLNonNull(GraphQLString) },
    total: { type: GraphQLNonNull(GraphQLFloat) },
    balanceDue: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (order) => order.balance_due,
    },
    paymentsApplied: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(PaymentType))),
      resolve: (order) => resolvers.getPaymentsByOrderId(order.id),
    },
  }),
});

const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  description: 'A payment',

  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    amount: { type: GraphQLNonNull(GraphQLFloat) },
    appliedAt: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (payment) => payment.applied_at,
    },
    note: { type: GraphQLNonNull(GraphQLString) },
    order: {
      type: GraphQLList(OrderType),
      resolve: (payment) => resolvers.getOrderById(payment.order_id),
    },
  }),
});

module.exports = { OrderType, PaymentType };
