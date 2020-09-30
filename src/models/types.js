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
    id: { description: 'The ID of the order', type: GraphQLNonNull(GraphQLID) },
    description: {
      description: 'The detailed description of the order',
      type: GraphQLNonNull(GraphQLString),
    },
    total: {
      description: 'The order total',
      type: GraphQLNonNull(GraphQLFloat),
    },
    balanceDue: {
      description: 'The remaining balance due',
      type: GraphQLNonNull(GraphQLFloat),
      resolve: (order) => order.balance_due,
    },
    paymentsApplied: {
      description: 'Payments applied to this order',
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(PaymentType))),
      resolve: (order) => resolvers.getPaymentsByOrderId(order.id),
    },
  }),
});

const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  description: 'A payment',

  fields: () => ({
    id: {
      description: 'The ID of the payment',
      type: GraphQLNonNull(GraphQLID),
    },
    amount: {
      description: 'The payment amount',
      type: GraphQLNonNull(GraphQLFloat),
    },
    appliedAt: {
      description: 'Timestamp when the payment was applied to the order',
      type: GraphQLNonNull(GraphQLString),
      resolve: (payment) => payment.applied_at,
    },
    note: {
      description: 'A note for the payment',
      type: GraphQLNonNull(GraphQLString),
    },
    order: {
      description: 'The order this payment is applied to',
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OrderType))),
      resolve: (payment) => resolvers.getOrderById(payment.order_id),
    },
  }),
});

module.exports = { OrderType, PaymentType };
